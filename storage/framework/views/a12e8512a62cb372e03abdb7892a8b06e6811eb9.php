<?php $__env->startSection('page-title'); ?>
    <h3 class="m-0 text-dark">Danh sách phiếu trả</h3>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('breadcrumb'); ?>
    <ol class="breadcrumb float-sm-right">
        <li class="breadcrumb-item"><a href="/">Trang chủ</a></li>
        <li class="breadcrumb-item active">Danh sách phiếu trả</li>
    </ol>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('content'); ?>
    <section class="content">
        <div class="container-fluid">

            
            <div class="card card-default">
                <div class="card-header btn" data-card-widget="collapse" data-toggle="tooltip" title="Collapse">
                    <h3 class="card-title">Tìm kiếm</h3>
                </div>
                <!-- /.card-header -->
                <div class="card-body">
                    <form action="<?php echo e(route('return.index')); ?>"
                          method="GET">
                        <div class="form-group">
                            <input type="text"
                                   class="form-control form-control-sm"
                                   name="keyword"
                                   value="<?php echo e(request('keyword')); ?>"
                                   placeholder="Mã phiếu trả, Người trả">
                        </div>
                        <!-- /.right -->
                        <div class="card card-default <?php echo e($isAdvancedSearch ? '': 'collapsed-card'); ?>">
                            <div class="card-header btn"
                                 data-card-widget="collapse" data-toggle="tooltip"
                                 title="Tìm kiếm nâng cao">
                                <h4 class="card-title">Tìm kiếm nâng cao</h4>
                            </div>
                            <!-- /.card-header s-->
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-2">
                                        <div class="form-group">
                                            <label for="return_date_search">Ngày trả</label>
                                            <div class="input-group">
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text">
                                                        <i class="far fa-calendar-alt"></i>
                                                    </span>
                                                </div>
                                                <input type="text" class="form-control form-control-sm"
                                                       id="return_date_search" name='return_date_search'
                                                       value="<?php echo e(request('return_date_search')); ?>">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- /.card-body -->
                        </div>
                        <div class="text-center">
                            <input type="reset" class="btn btn-sm btn-secondary reset" value="Hủy">
                            <input type="submit" class="btn btn-sm btn-primary" value="Tìm">
                        </div>
                    </form>
                    <!-- /.card -->
                </div>
                <!-- /.card-body -->
            </div>

            
            <div class="card">
                <div class="card-body">
                    <div class="row">

                        <div class="col-md-12" style="margin-bottom: 10px">
                            <b>Ngày giờ hiện tại: </b><span class="datetime-live"></span>
                        </div>

                        
                        <div class="col-md-12">
                            <table id="over_due_return_table"
                                   class="table table-sm table-striped table-bordered table-hover">
                                <thead>
                                <tr>
                                    <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->any(["Xem chi tiết phiếu trả"])): ?>
                                        <th>Action</th>
                                    <?php endif; ?>
                                    <th>Phiếu trả</th>
                                    <th>Người trả - Bộ môn</th>
                                    <th>Ngày trả</th>
                                    <th>Phiếu mượn</th>
                                </tr>
                                </thead>
                                <tbody>
                                <?php $__currentLoopData = $returns; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $return): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                    <tr>
                                        <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->any(["Xem chi tiết phiếu trả"])): ?>
                                            <td>
                                                <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check("Xem chi tiết phiếu mượn")): ?>
                                                    <a class="btn btn-xs btn-outline-info"
                                                       href="<?php echo e(route('return.detail', $return->id)); ?>"
                                                    ><i class="fa fa-info"></i>&nbsp;Xem
                                                    </a>
                                                <?php endif; ?>
                                            </td>
                                        <?php endif; ?>
                                        <td><?php echo e($return->ticket_no); ?></td>
                                        <td><?php echo e($return->return_full_name); ?> - <?php echo e($return->rental_ticket_BL->rented_department->name); ?></td>
                                        <td><?php echo e(date('d-m-Y', strtotime($return->returned_date))); ?></td>
                                        <td><a href="<?php echo e(route('rental.detail', $return->rental_ticket_BL->id)); ?>"><?php echo e($return->rental_ticket_BL->ticket_no); ?></a></td>
                                    </tr>
                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                </tbody>
                            </table>
                            <div class="row">
                                <div class="col-sm-12 col-md-5"></div>
                                <div class="col-sm-12 col-md-7">
                                    <div class="dataTables_wrapper m-2">
                                        <div class="dataTables_paginate paging_simple_numbers">
                                            <?php echo $returns->render(); ?>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /.card-body -->
            </div>
            <!-- /.card -->
        </div><!-- /.container-fluid -->
    </section>
    <!-- /.content -->
<?php $__env->stopSection(); ?>

<?php $__env->startSection('js'); ?>
    <script>
        $(".reset").on("click", function (e) {
            window.location = "<?php echo e(route("return.index")); ?>";
        });

        $('#return_date_search').daterangepicker({
            timePicker: false,
            singleDatePicker: true,
            autoUpdateInput: false,
            locale: {
                format: 'DD-MM-YYYY'
            },
        });
        $('#return_date_search').on('apply.daterangepicker', function (ev, picker) {
            $(this).val(picker.startDate.format('DD-MM-YYYY'));
        });

        $('#return_table').DataTable({
            "paging": true,
            "lengthChange": false,
            "searching": false,
            "ordering": true,
            "info": true,
            "autoWidth": false,
            "responsive": true,
            "pageLength": 10
        });
    </script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.master', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /home/u483135680/domains/cecics.com/public_html/cms/resources/views/return/index.blade.php ENDPATH**/ ?>