<?php $__env->startSection('page-title'); ?>
    <h3 class="m-0 text-dark">Danh sách Barcode</h3>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('breadcrumb'); ?>
    <ol class="breadcrumb float-sm-right">
        <li class="breadcrumb-item"><a href="/">Trang chủ</a></li>
        <li class="breadcrumb-item active">Barcode</li>
    </ol>
<?php $__env->stopSection(); ?>

<style>
</style>

<?php $__env->startSection('action-buttons'); ?>

<?php $__env->stopSection(); ?>

<?php $__env->startSection('content'); ?>
    <section class="content">
        <div class="container-fluid">

            <div class="card">
                <div class="card-header btn" data-card-widget="collapse"
                     data-toggle="tooltip" title="Collapse">
                    <h3 class="card-title">Tìm kiếm barcode</h3>
                </div>
                <div class="card-body">
                    <form action="<?php echo e(route('equipment.index')); ?>"
                          method="GET">
                        <div class="form-group">
                            <input type="text"
                                   class="form-control form-control-sm"
                                   name="keyword"
                                   value="<?php echo e(request('keyword')); ?>"
                                   placeholder="Barcode, Tên mô hình/thiết bị, ...">
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
                                    <div class="col-md-4">
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
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label for="departments_search">Tính năng</label>
                                            <select class="form-control form-control-sm select2"
                                                    multiple="multiple"
                                                    data-placeholder="Chọn tính năng để lọc"
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
                <div class="card-header">
                    <h3 class="card-title">Danh sách Barcode</h3>
                    <div class="card-tools">
                        <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check("Tạo barcode")): ?>
                            <a class="btn btn-sm btn-outline-info float-left"
                               href="/equipment/add">
                                Thêm Barcode
                            </a>
                        <?php endif; ?>
                    </div>
                </div>
                <div class="card-body">
                    <table id="equipment_table"
                           class="table table-sm table-striped table-bordered table-hover">
                        <thead>
                        <tr>
                            <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->any(["Sửa barcode","Tạo barcode-stt"])): ?>
                                <th class="text-center" style="width: 10%">
                                    Action
                                </th>
                            <?php endif; ?>
                            <th>Barcode</th>
                            <th>Tên</th>
                            <th>Thuộc tính</th>
                            <th>Bộ môn</th>
                            <th>SL barcode-stt</th>
                        </tr>
                        </thead>
                        <tbody>
                        <?php $__currentLoopData = $equipments; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $equipment): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <tr class="">
                                <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->any(["Sửa barcode","Tạo barcode-stt"])): ?>
                                    <td class="button-column">
                                        <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check("Sửa barcode")): ?>
                                            <a class="btn btn-xs btn-outline-warning"
                                               href="<?php echo e(route('equipment.edit',$equipment->id)); ?>"
                                            ><i class="fas fa-edit"></i> Sửa
                                            </a>
                                        <?php endif; ?>
                                        <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check("Tạo barcode-stt")): ?>
                                            <a class="btn btn-xs btn-outline-primary"
                                               href="<?php echo e(route('equipment_item.add',$equipment->id)); ?>"
                                            ><i class="fas fa-plus-circle"></i> Thêm STT
                                            </a>
                                        <?php endif; ?>
                                    </td>
                                <?php endif; ?>
                                <td><?php echo e($equipment->barcode); ?></td>
                                <td><?php echo e($equipment->name); ?></td>
                                <td><?php echo e($equipment->type->name); ?></td>
                                <td>
                                    <?php echo e(implode(", ", $equipment->departments->pluck("name")->toArray())); ?>

                                </td>
                                <td><?php echo e($equipment->items->count()); ?></td>
                            </tr>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                        </tbody>
                    </table>
                    <div class="row">
                        <div class="col-sm-12 col-md-5"></div>
                        <div class="col-sm-12 col-md-7">
                            <div class="dataTables_wrapper m-2">
                                <div class="dataTables_paginate paging_simple_numbers">
                                    <?php echo $equipments->render(); ?>

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
        //Initialize Select2 Elements
        $('.select2').select2();
        // Initialize DatatTable Elements
        $('#equipment_table').DataTable({
            "paging": false,
            "lengthChange": false,
            "searching": false,
            "ordering": false,
            "info": false,
            "autoWidth": false,
            "responsive": true,
        });
        $(".reset").on("click", function (e) {
            window.location = "<?php echo e(route('equipment.index')); ?>";
        });
    </script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.master', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /home/u483135680/domains/cecics.com/public_html/cms/resources/views/equipment/index.blade.php ENDPATH**/ ?>