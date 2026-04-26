<?php $__env->startSection('breadcrumb'); ?>
    <ol class="breadcrumb float-sm-right">
        <li class="breadcrumb-item"><a href="/">Home</a></li>
        <li class="breadcrumb-item"><a href="<?php echo e(route('user.index')); ?>">Danh sách người dùng</a></li>
        <li class="breadcrumb-item active">Tạo mới</li>
    </ol>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('content'); ?>
    <section class="content">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <form action="<?php echo e(route('user.update')); ?>" method="POST">
                        <?php echo csrf_field(); ?>
                        <?php echo method_field('patch'); ?>

                        <input hidden name="id" value="<?php echo e($user->id); ?>">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">Chỉnh sửa người dùng</h3>
                                <div class="card-tools">
                                    <button type="submit"
                                            class="btn btn-sm btn-info
                                         float-left save-button"
                                    ><i class="fas fa-save"></i>&nbsp;Lưu
                                    </button>
                                </div>
                            </div>
                            <div class="card-body">
                                <?php echo $__env->make('users.formPartial', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                            </div>
                        </div>
                    </form>
                    <!-- /.card-body -->
                </div>
                <!-- /.card -->
            </div>
        </div>
        <!-- /.row -->
    </section>
    <!-- /.content -->
<?php $__env->stopSection(); ?>

<?php $__env->startSection('js'); ?>
    <script>
    </script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.master', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /home/u483135680/domains/cecics.com/public_html/cms/resources/views/users/edit.blade.php ENDPATH**/ ?>