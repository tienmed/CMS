<?php $__env->startPush('stack-js'); ?>
    <script>
        <?php if(!empty($errors->first())): ?>
        let error_msg = '<ul>';
        <?php $__currentLoopData = $errors->all(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $error): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            error_msg += '<li><?php echo e($error); ?></li>'
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        toastr.warning(error_msg, '<strong>Rất tiếc!</strong>  Có một số vấn đề với dữ liệu mà bạn nhập.');
        <?php endif; ?>

        <?php if(Session::has('error_msg')): ?>
        let error_msg = '<?php echo Session::get('error_msg'); ?>';
        toastr.warning(error_msg);
        <?php endif; ?>

        <?php if(Session::has('success_msg')): ?>
        let sucess_msg = '<strong><?php echo Session::get('bold_msg'); ?></strong>' +
            '<?php echo Session::get('success_msg'); ?>';
        toastr.success(sucess_msg);
        <?php endif; ?>
    </script>
<?php $__env->stopPush(); ?>

<?php /**PATH /home/u483135680/domains/cecics.com/public_html/cms/resources/views/layouts/errors.blade.php ENDPATH**/ ?>