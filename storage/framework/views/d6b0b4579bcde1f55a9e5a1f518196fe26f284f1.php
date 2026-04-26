<?php $__env->startSection('title','CECICS - Tạo phiếu mượn'); ?>

<?php $__env->startSection('page-title'); ?>
    <h3 class="m-0 text-dark">Tạo mới phiếu mượn</h3>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('breadcrumb'); ?>
    <ol class="breadcrumb float-sm-right">
        <li class="breadcrumb-item"><a href="/">Home</a></li>
        <li class="breadcrumb-item"><a href="<?php echo e(route('rental.index')); ?>">Danh sách phiếu mượn</a></li>
        <li class="breadcrumb-item active">Tạo mới phiếu mượn</li>
    </ol>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('content'); ?>
    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-sm-12 col-md-12">
                    <!-- Main rental ticket -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Tạo phiếu mượn</h3>
                            <div class="card-tools">
                                <button type="submit" form="create_rental_form"
                                        class="btn btn-sm btn-outline-success">
                                    Lưu
                                </button>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class=" col-md-12">
                                <div class="row">
                                    <form id="create_rental_form"
                                          action="<?php echo e(route('rental.store')); ?>" method="POST">
                                        <?php echo csrf_field(); ?>
                                        <?php echo $__env->make('rental.formPartial', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer">
                            <div class="text-center">
                                <button type="submit" form="create_rental_form"
                                        class="btn btn-sm btn-outline-success">
                                    Lưu
                                </button>
                            </div>
                        </div>
                        <!-- /.card-body -->
                    </div>
                    <!-- /.card -->
                </div>
            </div>
            <!-- /.row -->
        </div>
    </section>
    <!-- /.content -->
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.master', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /home/u483135680/domains/cecics.com/public_html/cms/resources/views/rental/add.blade.php ENDPATH**/ ?>