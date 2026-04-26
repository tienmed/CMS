<?php $__env->startSection('title','CECICS - Danh sách barcode-stt'); ?>


<?php $__env->startSection('page-title'); ?>
    <h3 class="m-0 text-dark">Danh sách barcode-stt</h3>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('breadcrumb'); ?>
    <ol class="breadcrumb float-sm-right">
        <li class="breadcrumb-item"><a href="/">Trang chủ</a></li>
        <li class="breadcrumb-item active">Danh sách barcode-stt</li>
    </ol>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('content'); ?>
    <section class="content">
        <div class="container-fluid">
            <div class="card card-default">
                <div class="card-header">
                    <h3 class="card-title">Tìm kiếm</h3>
                    <div class="card-tools">
                        <button type="button" class="btn btn-tool"
                                data-card-widget="collapse"
                                data-toggle="tooltip"
                                title="Collapse">
                            <i class="fas fa-minus"></i>
                        </button>
                    </div>
                </div>
                <!-- /.card-header -->
                <div class="card-body">
                    <form action="<?php echo e(route('equipment_item.index')); ?>"
                          method="GET">
                        <div class="form-group">
                            <input type="text"
                                   class="form-control form-control-sm"
                                   name="keyword"
                                   value="<?php echo e(request('keyword')); ?>"
                                   placeholder="Barcode, Barcode-stt, Tên mô hình/thiết bị">
                        </div>
                        <div class="card card-default <?php echo e($isAdvancedSearch ? '': 'collapsed-card'); ?>">
                            <div class="card-header btn"
                                 data-card-widget="collapse" data-toggle="tooltip"
                                 title="Tìm kiếm nâng cao">
                                <h4 class="card-title">Tìm kiếm nâng cao</h4>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-2">
                                        <div class="form-group">
                                            <label for="rental_ticket_search">Mã phiếu mượn</label>
                                            <input type="text"
                                                   class="form-control form-control-sm"
                                                   name="rental_ticket_search" id="rental_ticket_search"
                                                   value="<?php echo e(request('rental_ticket_search')); ?>"
                                                   placeholder="Mã phiếu mượn...">
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="form-group">
                                            <label for="type_search">Thuộc tính</label>
                                            <select id="type_search" name="type_search"
                                                    class="form-control form-control-sm custom-select custom-select-sm">
                                                <option value="" selected>All</option>
                                                <?php $__currentLoopData = $types; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $type): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                                    <option value="<?php echo e($type->id); ?>"
                                                        <?php echo e(request('type_search') == $type->id ? 'selected' : ''); ?>

                                                    ><?php echo e($type->name); ?></option>
                                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="form-group">
                                            <label for="condition_search">Tình trạng</label>
                                            <select id="condition_search" name="condition_search"
                                                    class="form-control form-control-sm custom-select custom-select-sm">
                                                <option value="" selected>All</option>
                                                <?php $__currentLoopData = $conditions; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $condition): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                                    <option value="<?php echo e($condition->id); ?>"
                                                        <?php echo e(request('condition_search') == $condition->id ? 'selected' : ''); ?>

                                                    ><?php echo e($condition->name); ?></option>
                                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="form-group">
                                            <label for="status_search">Trạng thái</label>
                                            <select id="status_search" name="status_search"
                                                    class="form-control form-control-sm custom-select custom-select-sm">
                                                <option value="" selected>All</option>
                                                <?php $__currentLoopData = $statuses; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $status): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                                    <option value="<?php echo e($status->id); ?>"
                                                        <?php echo e(request('status_search') == $status->id ? 'selected' : ''); ?>

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
                        </div>
                        <div class="text-center">
                            <input type="reset" class="btn btn-sm btn-secondary reset" value="Hủy">
                            <input type="submit" class="btn btn-sm btn-primary" value="Tìm">
                        </div>
                    </form>
                </div>
            </div>

            <div class="card">
                <div class="card-body">
                    <table id="equipment_item_table"
                           class="table table-sm table-striped table-bordered table-hover">
                        <thead>
                        <tr>
                            <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->any(["Sửa barcode-stt"])): ?>
                                <th class="text-center" style="width: 10%">
                                    Action
                                </th>
                            <?php endif; ?>
                            <th>Barcode-stt</th>
                            <th>Tên</th>
                            <th>Thuộc tính</th>
                            <th>Tính năng</th>
                            <th>Tình trạng</th>
                            <th>Trạng thái</th>
                            <th>Phiếu mượn</th>
                        </tr>
                        </thead>
                        <tbody>
                        <?php $__currentLoopData = $items; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <tr class="">
                                <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->any(["Sửa barcode-stt"])): ?>
                                    <td class="button-column">
                                        <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check(["Sửa barcode-stt"])): ?>
                                            <a class="btn btn-xs btn-outline-warning"
                                               href="<?php echo e(route('equipment_item.edit', $item->id)); ?>"
                                            ><i class="fas fa-edit"></i> Xem
                                            </a>
                                        <?php endif; ?>
                                    </td>
                                <?php endif; ?>
                                <td><?php echo e($item->barcode_stt); ?></td>
                                <td><?php echo e($item->equipment->name); ?></td>
                                <td><?php echo e($item->equipment->type->name); ?></td>
                                <td>
                                    <?php echo e(implode(", ", $item->equipment->departments->pluck("name")->toArray())); ?>

                                </td>
                                <td>
                                    <?php if(empty($item->condition->bg_color)): ?>
                                        <span>
                                        <?php echo e($item->condition->name); ?>

                                        </span>
                                    <?php else: ?>
                                        <span class='badge text-white'
                                              style="background-color: <?php echo e('#'. $item->condition->bg_color); ?>">
                                        <?php echo e($item->condition->name); ?>

                                        </span>
                                    <?php endif; ?>

                                </td>
                                <td>
                                    <?php if(empty($item->equipment_status->bg_color)): ?>
                                        <span>
                                        <?php echo e($item->equipment_status->name); ?>

                                        </span>
                                    <?php else: ?>
                                        <span class='badge text-white'
                                              style="background-color: <?php echo e('#'.$item->equipment_status->bg_color); ?>">
                                        <?php echo e($item->equipment_status->name); ?>

                                        </span>
                                    <?php endif; ?>

                                </td>
                                    <td>
                                        <?php if(!empty($item->current_rented_ticket)): ?>
                                            <a href="<?php echo e(route('rental.detail',$item->current_rented_ticket->id)); ?>"
                                               title="Chi tiết phiếu mượn"
                                            ><?php echo e($item->current_rented_ticket->ticket_no); ?></a>
                                        <?php endif; ?>
                                    </td>
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
            window.location = "<?php echo e(route('equipment_item.index')); ?>";
        });
    </script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.master', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /home/u483135680/domains/cecics.com/public_html/cms/resources/views/equipment_item/index.blade.php ENDPATH**/ ?>