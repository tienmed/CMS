<!DOCTYPE html>
<html lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="x-ua-compatible" content="ie=edge">

    <title><?php echo $__env->yieldContent('title','CECICS - CMS | Login'); ?></title>

    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="<?php echo e(asset('plugins/fontawesome-free/css/all.min.css')); ?>">
    <!-- IonIcons -->
    <link rel="stylesheet" href="<?php echo e(asset('plugins/ionicons-2.1.0/css/ionicons.min.css')); ?>">
    <!-- iCheck for checkboxes and radio inputs -->
    <link rel="stylesheet" href="<?php echo e(asset('plugins/icheck-bootstrap/icheck-bootstrap.min.css')); ?>">
    <!-- Toastr -->
    <link rel="stylesheet" href="<?php echo e(asset('plugins/toastr/toastr.min.css')); ?>">
    <!-- Theme style -->
    <link rel="stylesheet" href="<?php echo e(asset('asset/css/adminlte.min.css')); ?>">
    <!-- Google Font: Source Sans Pro -->
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700" rel="stylesheet">
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>"/>
</head>
<body class="hold-transition login-page">
<div class="login-box">
    <div class="login-logo">
        <a href="/"><b>CECICS</b>&nbsp;CMS</a>
    </div>
    <!-- /.login-logo -->
    <div class="card">
        <div class="card-body login-card-body">
            <p class="login-box-msg">Sign in to start your session</p>

            <form action="<?php echo e(route('login')); ?>" method="POST">
                <?php echo csrf_field(); ?>
                <div class="input-group mb-3">
                    <input type="text" class="form-control"
                           name="login"
                           placeholder="Username">
                    <div class="input-group-append">
                        <div class="input-group-text">
                            <span class="fas fa-user-alt"></span>
                        </div>
                    </div>
                </div>
                <div class="input-group mb-3">
                    <input type="password" class="form-control"
                           name="password"
                           placeholder="Password">
                    <div class="input-group-append">
                        <div class="input-group-text">
                            <span class="fas fa-lock"></span>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-8">
                        <div class="icheck-primary">
                            <input type="checkbox"
                                   name="remember"
                                   id="remember">
                            <label for="remember">
                                Remember Me
                            </label>
                        </div>
                    </div>
                    <!-- /.col -->
                    <div class="col-4">
                        <button type="submit" class="btn btn-primary btn-block">Sign In</button>
                    </div>
                    <!-- /.col -->
                </div>
            </form>
        </div>
        <!-- /.login-card-body -->
    </div>
</div>
<!-- jQuery -->
<script src="<?php echo e(asset('plugins/jquery/jquery.min.js')); ?>"></script>
<!-- Bootstrap -->
<script src="<?php echo e(asset('plugins/bootstrap/js/bootstrap.bundle.min.js')); ?>"></script>
<!-- Toastr -->
<script src="<?php echo e(asset('plugins/toastr/toastr.min.js')); ?>"></script>
<!-- AdminLTE -->
<script src="<?php echo e(asset('asset/js/adminlte.js')); ?>"></script>
<!-- OPTIONAL SCRIPTS -->
<script>
    <?php if(!empty($errors->first())): ?>
    let error_msg = '<ul>';
    <?php $__currentLoopData = $errors->all(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $error): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        error_msg += '<li><?php echo e($error); ?></li>'
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    toastr.warning(error_msg, '<strong>Rất tiếc!</strong> Có một số vấn đề với dữ liệu mà bạn nhập.');
    <?php endif; ?>

    <?php if(Session::has('error_msg')): ?>
    toastr.warning(<?php echo Session::get("error_msg"); ?>);
    <?php endif; ?>

    <?php if(Session::has('success_msg')): ?>
    let sucess_msg = '<strong><?php echo Session::get('bold_msg'); ?></strong>' +
        '<?php echo Session::get('success_msg'); ?>';
    toastr.success(sucess_msg);
    <?php endif; ?>
</script>
</body>
</html>
<?php /**PATH /home/u483135680/domains/cecics.com/public_html/cms/resources/views/auth/login.blade.php ENDPATH**/ ?>