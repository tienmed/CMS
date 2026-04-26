<?php $__env->startSection('page-title'); ?>
    <h3 class="m-0 text-dark">Danh sách phiếu mượn</h3>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('breadcrumb'); ?>
    <ol class="breadcrumb float-sm-right">
        <li class="breadcrumb-item"><a href="/">Trang chủ</a></li>
        <li class="breadcrumb-item active">Danh sách phiếu mượn</li>
    </ol>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('action-buttons'); ?>
    <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check("Tạo phiếu mượn")): ?>
        <div>
            <a href="/rental/add" class="btn btn-sm btn-outline-primary">
                Thêm phiếu mượn
            </a>
        </div>
    <?php endif; ?>
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
                    <form action="<?php echo e(route('rental.index')); ?>"
                          method="GET">
                        <div class="form-group">
                            <input type="text"
                                   class="form-control form-control-sm"
                                   name="keyword"
                                   value="<?php echo e(request('keyword')); ?>"
                                   placeholder="Mã phiếu mượn, Người mượn">
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
                                            <label for="department_search">Bộ môn</label>
                                            <select id="department_search" name="department_search"
                                                    class="form-control form-control-sm custom-select custom-select-sm">
                                                <option value="" selected>All</option>
                                                <?php $__currentLoopData = $departments; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $department): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                                    <option value="<?php echo e($department->id); ?>"
                                                        <?php echo e(request('department_search') == $department->id ? 'selected' : ''); ?>

                                                    ><?php echo e($department->name); ?></option>
                                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="form-group">
                                            <label for="rental_status_search">Trạng thái</label>
                                            <select id="rental_status_search" name="rental_status_search"
                                                    class="form-control form-control-sm custom-select custom-select-sm">
                                                <option value="" selected>All</option>
                                                <?php $__currentLoopData = $rental_statuses; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $idx => $rental_status): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                                    <option value="<?php echo e($idx); ?>"
                                                        <?php echo e(request('rental_status_search') == $idx ? 'selected' : ''); ?>

                                                    ><?php echo e($rental_status); ?></option>
                                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="form-group">
                                            <label for="rented_date_search">Ngày mượn</label>
                                            <div class="input-group">
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text">
                                                        <i class="far fa-calendar-alt"></i>
                                                    </span>
                                                </div>
                                                <input type="text" class="form-control form-control-sm"
                                                       id="rented_date_search" name='rented_date_search'
                                                       value="<?php echo e(request('rented_date_search')); ?>">
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
                            <table id="over_due_rental_table"
                                   class="table table-sm table-striped table-bordered table-hover">
                                <thead>
                                <tr>
                                    <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->any(["Xem chi tiết phiếu mượn","Tạo phiếu trả"])): ?>
                                        <th>Action</th>
                                    <?php endif; ?>
                                    <th>Phiếu mượn</th>
                                    <th>Người mượn - Bộ môn</th>
                                    <th>Ngày mượn</th>
                                    <th>Hạn trả</th>
                                    <th>Hoàn tất trả</th>
                                    <th>Tình trạng</th>
                                </tr>
                                </thead>
                                <tbody>
                                <?php $__currentLoopData = $rentals; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $rental): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                    <tr>
                                        <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->any(["Xem chi tiết phiếu mượn","Tạo phiếu trả"])): ?>
                                            <td>
                                                <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check("Xem chi tiết phiếu mượn")): ?>
                                                    <a class="btn btn-xs btn-outline-info"
                                                       href="<?php echo e(route('rental.detail', $rental->id)); ?>"
                                                    ><i class="fa fa-info"></i>&nbsp;Xem
                                                    </a>
                                                <?php endif; ?>
                                                <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check("Tạo phiếu trả")): ?>
                                                    <?php if(empty($rental->completed_date)): ?>
                                                        <a class="btn btn-xs btn-success"
                                                           href="<?php echo e(route('return.add', $rental->id)); ?>"
                                                        ><i class="fa fa-undo"></i>&nbsp;Trả
                                                        </a>
                                                    <?php endif; ?>
                                                <?php endif; ?>
                                            </td>
                                        <?php endif; ?>
                                        <td><?php echo e($rental->ticket_no); ?></td>
                                        <td><?php echo e($rental->rented_full_name); ?>

                                            - <?php echo e($rental->rented_department->name); ?></td>
                                        <td><?php echo e(date('d-m-Y', strtotime($rental->rented_date))); ?></td>
                                        <td><?php echo e(date('d-m-Y', strtotime($rental->due_date))); ?></td>
                                        <td>
                                            <?php if(empty($rental->completed_date)): ?>
                                                <?php
                                                    $date_diff = (int) (new \DateTime('now'))->diff((new \DateTime($rental->due_date))->setTime(23, 59, 59))->format("%r%a");
                                                ?>
                                                <?php if($date_diff < 0 ): ?>
                                                    <span class="badge badge-danger">
                                                        Quá qui định <?php echo e(-$date_diff); ?> ngày
                                                    </span>
                                                <?php elseif($date_diff <= 7 ): ?>
                                                    <span class="badge badge-warning">
                                                        Chỉ còn <?php echo e($date_diff); ?> ngày
                                                    </span>
                                                <?php else: ?>
                                                    <span class="badge badge-info">
                                                        Còn <?php echo e($date_diff); ?> ngày
                                                    </span>
                                                <?php endif; ?>

                                            <?php else: ?>
                                                <span>
                                                    Đã trả (<?php echo e(date('d-m-Y', strtotime($rental->completed_date))); ?>)
                                                </span>
                                            <?php endif; ?>
                                        </td>
                                        <td><?php echo e(!count($rental->returned_tickets) ? "Chưa trả" : (empty($rental->completed_date) ? "Đã trả một phần" :"Đã hoàn thành")); ?></td>
                                    </tr>
                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                </tbody>
                            </table>
                            <div class="row">
                                <div class="col-sm-12 col-md-5"></div>
                                <div class="col-sm-12 col-md-7">
                                    <div class="dataTables_wrapper m-2">
                                        <div class="dataTables_paginate paging_simple_numbers">
                                            <?php echo $rentals->render(); ?>

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
            window.location = "<?php echo e(route("rental.index")); ?>";
        });

        $('#rented_date_search').daterangepicker({
            timePicker: false,
            singleDatePicker: true,
            autoUpdateInput: false,
            locale: {
                format: 'DD-MM-YYYY'
            },
        });
        $('#rented_date_search').on('apply.daterangepicker', function (ev, picker) {
            $(this).val(picker.startDate.format('DD-MM-YYYY'));
        });

        $('#rental_table').DataTable({
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

<?php echo $__env->make('layouts.master', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /home/u483135680/domains/cecics.com/public_html/cms/resources/views/rental/index.blade.php ENDPATH**/ ?>