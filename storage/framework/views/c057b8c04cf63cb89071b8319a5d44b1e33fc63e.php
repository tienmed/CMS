<?php $__env->startSection('page-title'); ?>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('breadcrumb'); ?>
    <ol class="breadcrumb float-sm-right">
        <li class="breadcrumb-item"><a href="/">Trang chủ</a></li>
        <li class="breadcrumb-item"><a href="/equipment">Danh sách Barcode</a></li>
        <li class="breadcrumb-item"><a
                href="<?php echo e(route('equipment.edit', $equipment->id)); ?>"><?php echo e($equipment->barcode); ?></a></li>
        <li class="breadcrumb-item active">Thêm mới</li>
    </ol>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('action-buttons'); ?>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('content'); ?>
    <form action="<?php echo e(route('equipment_item.store', $equipment->id)); ?>" method="POST">
        <?php echo csrf_field(); ?>
        <section class="content">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-12">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">Thêm thiết bị - Thông tin chung</h3>
                                <div class="card-tools">
                                    <button type="submit"
                                            class="btn btn-sm btn-outline-success float-left">
                                        Lưu
                                    </button>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="equipment-item-information">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="row">
                                                <div class="col-sm-6 col-md-3 col-xl-3">
                                                    <div class="form-group">
                                                        <label for="barcode">Barcode mô hình - thiết bị</label>
                                                        <input type="text" readonly
                                                               class="form-control form-control-sm"
                                                               id="barcode" name="barcode"
                                                               value="<?php echo e($equipment->barcode); ?>">
                                                    </div>
                                                </div>
                                                <div class="col-sm-6 col-md-3 col-xl-3">
                                                    <div class="form-group">
                                                        <label for="equipment_name">Tên mô hình - thiết bị</label>
                                                        <input type="text" readonly
                                                               class="form-control form-control-sm"
                                                               id="equipment_name" name="equipment_name"
                                                               value="<?php echo e($equipment->name); ?>">
                                                    </div>
                                                </div>
                                                <div class="col-sm-6 col-md-3 col-xl-3">
                                                    <div class="form-group">
                                                        <label for="stt">STT</label>
                                                        <input type="number" min=1
                                                               class="form-control form-control-sm"
                                                               id="stt" name="stt"
                                                               value="<?php echo e(old('stt')); ?>"
                                                               placeholder="Stt number">
                                                    </div>
                                                </div>
                                                <div class="col-sm-6 col-md-3 col-xl-3">
                                                    <div class="form-group">
                                                        <label for="barcode_stt">Barcode-stt</label>
                                                        <input type="text"
                                                               class="form-control form-control-sm"
                                                               id="barcode_stt" name="barcode_stt"
                                                               value="<?php echo e(old('barcode_stt',$equipment->barcode . '-')); ?>"
                                                               readonly>
                                                    </div>
                                                </div>
                                                <div class="col-sm-6 col-md-3 col-xl-3">
                                                    <div class="form-group">
                                                        <label for="condition">Tình trạng</label>
                                                        <select id="condition" name="condition"
                                                                class="form-control custom-select ">
                                                            <?php $__currentLoopData = $conditions; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $condition): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                                                <option value="<?php echo e($condition->id); ?>"
                                                                    <?php echo e(old('condition',1) == $condition->id ? 'selected' : ''); ?>>
                                                                    <?php echo e($condition->name); ?>

                                                                </option>
                                                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-sm-6 col-md-3 col-xl-3">
                                                    <div class="form-group">
                                                        <label for="status">Trạng thái</label>
                                                        <select id="status" name="status"
                                                                class="form-control custom-select ">
                                                            <?php $__currentLoopData = $statuses; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $status): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                                                <option value="<?php echo e($status->id); ?>"
                                                                    <?php echo e(old('status',1) == $status->id ? 'selected' : ''); ?>>
                                                                    <?php echo e($status->name); ?>

                                                                </option>
                                                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-sm-12 col-md-12 col-xl-12">
                                                    <div class="form-group">
                                                        <label for="note">Ghi Chú</label>
                                                        <textarea class="form-control form-control-sm" rows="4"
                                                                  id="note" name="note"
                                                                  placeholder="Ghi chú thông tin barcode-stt..."
                                                        ><?php echo e(old('note')); ?></textarea>
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
                    </div>
                </div>
                <!-- /.row -->
            </div><!-- /.container -->
        </section>
        <!-- /.content -->
    </form>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('js'); ?>
    <script>
        $(document).ready(function ($) {
            $("input#barcode_stt").val($("input#barcode").val() + "-" + $("input#stt").val());
        });

        $("input#stt").on('input', function () {
            $("input#barcode_stt").val($("input#barcode").val() + "-" + $(this).val());
        });
    </script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.master', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /home/u483135680/domains/cecics.com/public_html/cms/resources/views/equipment_item/add.blade.php ENDPATH**/ ?>