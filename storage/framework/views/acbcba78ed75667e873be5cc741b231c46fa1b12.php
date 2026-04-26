<?php $__env->startSection('page-title'); ?>
    <h3 class="m-0 text-dark">Lịch sử mượn thiết bị</h3>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('breadcrumb'); ?>
    <ol class="breadcrumb float-sm-right">
        <li class="breadcrumb-item"><a href="/">Trang chủ</a></li>
        <li class="breadcrumb-item active">Lịch sử mượn thiết bị</li>
    </ol>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('content'); ?>
    <section class="content">
        <div class="container-fluid">
            <form action="<?php echo e(route('rental.rental_history')); ?>"
                    method="GET">
                <div class="card card-default">
                    <div class="card-header btn"
                            data-card-widget="collapse" data-toggle="tooltip"
                            title="Tìm kiếm nâng cao">
                        <h4 class="card-title">Tìm kiếm nâng cao</h4>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="row">
                                    <div class="col-md-2">
                                        <div class="form-group">
                                            <label for="item_status_search">Barcode-STT</label>
                                            <div class="form-group">
                                                <input type="text"
                                                    class="form-control form-control-sm"
                                                    name="barcode_stt"
                                                    value="<?php echo e(request('barcode_stt')); ?>"
                                                    placeholder="Barcode - stt">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="form-group">
                                            <label for="item_status_search">Trạng thái</label>
                                            <select id="item_status_search" name="item_status_search"
                                                    class="form-control form-control-sm custom-select custom-select-sm">
                                                <option value="" selected>All</option>
                                                <?php $__currentLoopData = $statuses; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $status): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                                    <option value="<?php echo e($status->id); ?>"
                                                        <?php echo e(request('item_status_search') == $status->id ? 'selected' : ''); ?>

                                                    ><?php echo e($status->name); ?></option>
                                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label for="departments_search">Bộ môn</label>
                                            <select class="form-control form-control-sm select2"
                                                    multiple="multiple"
                                                    data-placeholder="Chọn bộ môn để lọc"
                                                    data-dropdown-css-class="select2-primary"
                                                    id="departments_search" name="departments_search[]"
                                                    style="width: 100%;">
                                                <?php $__currentLoopData = $departments; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $department): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                                    <option value="<?php echo e($department->id); ?>"
                                                        <?php echo e((request('departments_search') !='' and in_array($department->id, request('departments_search'))) ? 'selected' : ''); ?>

                                                    ><?php echo e($department->name); ?></option>
                                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="row">
                                    <div class="col-md-2">
                                        <div class="form-group">
                                            <label for="rented_date_lower_search">Ngày mượn (từ)</label>
                                            <div class="input-group">
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text">
                                                        <i class="far fa-calendar-alt"></i>
                                                    </span>
                                                </div>
                                                <input type="text" class="form-control form-control-sm"
                                                        id="rented_date_lower_search" name='rented_date_lower_search'
                                                        value="<?php echo e(request('rented_date_lower_search')); ?>">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="form-group">
                                            <label for="rented_date_upper_search">Ngày mượn (đến)</label>
                                            <div class="input-group">
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text">
                                                        <i class="far fa-calendar-alt"></i>
                                                    </span>
                                                </div>
                                                <input type="text" class="form-control form-control-sm"
                                                        id="rented_date_upper_search" name='rented_date_upper_search'
                                                        value="<?php echo e(request('rented_date_upper_search')); ?>">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="form-group">
                                            <label for="rental_condition_search">Tình trạng khi mượn</label>
                                            <select id="rental_condition_search" name="rental_condition_search"
                                                    class="form-control form-control-sm custom-select custom-select-sm">
                                                <option value="" selected>All</option>
                                                <?php $__currentLoopData = $conditions; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $condition): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                                    <option value="<?php echo e($condition->id); ?>"
                                                        <?php echo e(request('rental_condition_search') == $condition->id ? 'selected' : ''); ?>

                                                    ><?php echo e($condition->name); ?></option>
                                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="form-group">
                                            <label for="returned_date_lower_search">Ngày trả (từ)</label>
                                            <div class="input-group">
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text">
                                                        <i class="far fa-calendar-alt"></i>
                                                    </span>
                                                </div>
                                                <input type="text" class="form-control form-control-sm"
                                                        id="returned_date_lower_search" name='returned_date_lower_search'
                                                        value="<?php echo e(request('returned_date_lower_search')); ?>">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="form-group">
                                            <label for="returned_date_upper_search">Ngày trả (đến)</label>
                                            <div class="input-group">
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text">
                                                        <i class="far fa-calendar-alt"></i>
                                                    </span>
                                                </div>
                                                <input type="text" class="form-control form-control-sm"
                                                        id="returned_date_upper_search" name='returned_date_upper_search'
                                                        value="<?php echo e(request('returned_date_upper_search')); ?>">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="form-group">
                                            <label for="return_condition_search">Tình trạng khi trả</label>
                                            <select id="return_condition_search" name="return_condition_search"
                                                    class="form-control form-control-sm custom-select custom-select-sm">
                                                <option value="" selected>All</option>
                                                <?php $__currentLoopData = $conditions; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $condition): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                                    <option value="<?php echo e($condition->id); ?>"
                                                        <?php echo e(request('return_condition_search') == $condition->id ? 'selected' : ''); ?>

                                                    ><?php echo e($condition->name); ?></option>
                                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <div class="text-center">
                            <input type="reset" class="btn btn-sm btn-secondary reset" value="Hủy">
                            <input type="submit" class="btn btn-sm btn-primary" value="Tìm">
                        </div>
                    </div>
                </div>
            </form>

            <div class="card">
                <div class="card-body">
                    <table id="equipment_item_table"
                           class="table table-sm table-striped table-bordered table-hover">
                        <thead>
                        <tr>
                            <th>Barcode-stt</th>
                            <th>Tên</th>
                            <th>Bộ môn</th>
                            <th>Phiếu mượn</th>
                            <th>Người mượn</th>
                            <th>Ngày mượn</th>
                            <th>Tình trạng khi mượn</th>
                            <th>Phiếu trả</th>
                            <th>Người trả</th>
                            <th>Ngày trả</th>
                            <th>Tình trạng khi trả</th>
                            <th>Trạng thái</th>
                        </tr>
                        </thead>
                        <tbody>
                        <?php $__currentLoopData = $items; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $rental_item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <tr class="">
                                <td><?php echo e($rental_item->item_info->barcode_stt); ?></td>
                                <td><?php echo e($rental_item->item_info->equipment->name); ?></td>
                                <td><?php echo e($rental_item->rental_ticket->rented_department->name); ?></td>
                                <td><a href="<?php echo e(route('rental.detail', $rental_item->rental_ticket->id)); ?>"><?php echo e($rental_item->rental_ticket->ticket_no); ?></a></td>
                                <td><?php echo e($rental_item->rental_ticket->rented_full_name); ?></td>
                                <td><?php echo e(date("d-m-Y", strtotime($rental_item->rental_ticket->rented_date))); ?></td>
                                <td>
                                    <?php if(empty($rental_item->rented_condition->bg_color)): ?>
                                        <span>
                                        <?php echo e($rental_item->rented_condition->name); ?>

                                        </span>
                                    <?php else: ?>
                                        <span class='badge text-white'
                                              style="background-color: <?php echo e('#'. $rental_item->rented_condition->bg_color); ?>">
                                        <?php echo e($rental_item->rented_condition->name); ?>

                                        </span>
                                    <?php endif; ?>

                                </td>
                                <?php if(!empty($rental_item->deleted_at)): ?>
                                    <td><a href="<?php echo e(route('return.detail', $rental_item->returned_detail->return_ticket->id)); ?>"><?php echo e($rental_item->returned_detail->return_ticket->ticket_no); ?></a></td>
                                    <td><?php echo e($rental_item->returned_detail->return_ticket->return_full_name); ?></td>
                                    <td><?php echo e(date("d-m-Y", strtotime($rental_item->returned_detail->return_date))); ?></td>
                                    <td>
                                        <?php if(empty($rental_item->returned_detail->returned_condition->bg_color)): ?>
                                            <span>
                                            <?php echo e($rental_item->returned_detail->returned_condition->name); ?>

                                            </span>
                                        <?php else: ?>
                                            <span class='badge text-white'
                                                style="background-color: <?php echo e('#'.$rental_item->returned_detail->returned_condition->bg_color); ?>">
                                            <?php echo e($rental_item->returned_detail->returned_condition->name); ?>

                                            </span>
                                        <?php endif; ?>

                                    </td>
                                <?php else: ?>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <?php endif; ?>
                                <td><?php echo e($rental_item->item_info->equipment_status->name); ?></td>
                            </tr>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                        </tbody>
                    </table>
                    <div class="row">
                        <div class="col-sm-12 col-md-5"></div>
                        <div class="col-sm-12 col-md-7">
                            <div class="dataTables_wrapper m-2">
                                <div class="dataTables_paginate paging_simple_numbers">
                                    <?php echo $items->render(); ?>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('js'); ?>
    <script>
        $('#rented_date_upper_search').daterangepicker({
            timePicker: false,
            singleDatePicker: true,
            autoUpdateInput: false,
            locale: {
                format: 'DD-MM-YYYY'
            },
        });
        $('#rented_date_upper_search').on('apply.daterangepicker', function (ev, picker) {
            $(this).val(picker.startDate.format('DD-MM-YYYY'));
        });
        $('#rented_date_lower_search').daterangepicker({
            timePicker: false,
            singleDatePicker: true,
            autoUpdateInput: false,
            locale: {
                format: 'DD-MM-YYYY'
            },
        });
        $('#rented_date_lower_search').on('apply.daterangepicker', function (ev, picker) {
            $(this).val(picker.startDate.format('DD-MM-YYYY'));
        });
        
        $('#returned_date_upper_search').daterangepicker({
            timePicker: false,
            singleDatePicker: true,
            autoUpdateInput: false,
            locale: {
                format: 'DD-MM-YYYY'
            },
        });
        $('#returned_date_upper_search').on('apply.daterangepicker', function (ev, picker) {
            $(this).val(picker.startDate.format('DD-MM-YYYY'));
        });
        $('#returned_date_lower_search').daterangepicker({
            timePicker: false,
            singleDatePicker: true,
            autoUpdateInput: false,
            locale: {
                format: 'DD-MM-YYYY'
            },
        });
        $('#returned_date_lower_search').on('apply.daterangepicker', function (ev, picker) {
            $(this).val(picker.startDate.format('DD-MM-YYYY'));
        });
        $('.select2').select2();
        $('#equipment_item_table').DataTable({
            "paging": false,
            "lengthChange": false,
            "searching": false,
            "ordering": false,
            "info": false,
            "autoWidth": false,
            "responsive": true,
        });
        $(".reset").on("click", function (e) {
            window.location = "<?php echo e(route('rental.rental_history')); ?>";
        });
    </script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.master', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /home/u483135680/domains/cecics.com/public_html/cms/resources/views/rental/rental_history.blade.php ENDPATH**/ ?>