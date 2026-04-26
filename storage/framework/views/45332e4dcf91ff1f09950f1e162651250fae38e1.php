<!DOCTYPE html>
<html lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>"/>

    <title><?php echo $__env->yieldContent('title','CECICS - CMS'); ?></title>

    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="<?php echo e(asset('plugins/fontawesome-free/css/all.min.css')); ?>">
    <!-- IonIcons -->
    <link rel="stylesheet" href="<?php echo e(asset('plugins/ionicons-2.1.0/css/ionicons.min.css')); ?>">
    <!-- daterange picker -->
    <link rel="stylesheet" href="<?php echo e(asset('plugins/daterangepicker/daterangepicker.css')); ?>">
    <!-- iCheck for checkboxes and radio inputs -->
    <link rel="stylesheet" href="<?php echo e(asset('plugins/icheck-bootstrap/icheck-bootstrap.min.css')); ?>">
    <!-- Bootstrap Color Picker -->
    <link rel="stylesheet" href="<?php echo e(asset('plugins/bootstrap-colorpicker/css/bootstrap-colorpicker.min.css')); ?>">
    <!-- Tempusdominus Bbootstrap 4 -->
    <link rel="stylesheet" href="<?php echo e(asset('plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css')); ?>">
    <!-- Select2 -->
    <link rel="stylesheet" href="<?php echo e(asset('plugins/select2/css/select2.min.css')); ?>">
    <link rel="stylesheet" href="<?php echo e(asset('plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css')); ?>">
    <!-- Bootstrap4 Duallistbox -->
    <link rel="stylesheet" href="<?php echo e(asset('plugins/bootstrap4-duallistbox/bootstrap-duallistbox.min.css')); ?>">
    <!-- DataTables -->
    <link rel="stylesheet" href="<?php echo e(asset('plugins/datatables-bs4/css/dataTables.bootstrap4.min.css')); ?>">
    <link rel="stylesheet" href="<?php echo e(asset('plugins/datatables-responsive/css/responsive.bootstrap4.min.css')); ?>">
    <!-- daterange picker -->
    <link rel="stylesheet" href="<?php echo e(asset('plugins/daterangepicker/daterangepicker.css')); ?>">
    <!-- Toastr -->
    <link rel="stylesheet" href="<?php echo e(asset('plugins/toastr/toastr.min.css')); ?>">
    <!-- Option CSS -->
<?php echo $__env->yieldContent('page-header'); ?>
<?php echo $__env->yieldPushContent('stack-page-header'); ?>
<!-- Theme style -->
    <link rel="stylesheet" href="<?php echo e(asset('asset/css/adminlte.min.css')); ?>">
    <!-- Google Font: Source Sans Pro -->
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700" rel="stylesheet">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="<?php echo e(asset('asset/css/stylesheet.css?v=3.2')); ?>">
</head>
<body class="sidebar-mini control-sidebar-slide-open accent-lightblue">
<div class="wrapper">
    <!-- Navbar -->
<?php echo $__env->make('layouts.nav', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
<!-- /.navbar -->

    <!-- Main Sidebar Container -->
<?php echo $__env->make('layouts.sidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>

<!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
        <!-- Content Header (Page header) -->
        <div class="content-header">
            <div class="container-fluid">
                <div class="row mb-2">
                    <div class="col-sm-6">
                        <?php echo $__env->yieldContent('page-title'); ?>
                    </div><!-- /.col -->
                    <div class="col-sm-6">
                        <?php echo $__env->yieldContent('breadcrumb'); ?>
                    </div><!-- /.col -->
                </div><!-- /.row -->
                <div class="row">
                    <div class="col-md-6" style="display:flex; justify-content: flex-start;">
                        <?php echo $__env->yieldContent('custom-headers'); ?>
                    </div>
                    <div class="col-md-6" style="display:flex; justify-content: flex-end;">
                        <?php echo $__env->yieldContent('action-buttons'); ?>
                    </div>
                </div><!-- /.row -->
            </div><!-- /.container-fluid -->
        </div>
        <!-- /.content-header -->

        <!-- Main content -->
        <div class="content">
            <div class="container">
                <?php echo $__env->make('layouts.errors', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
            </div>
            <div class="container-fluid">
            <?php echo $__env->yieldContent('content'); ?>
            <?php echo $__env->yieldContent('modal'); ?>
            <!-- /.row -->
            </div>
            <!-- /.container-fluid -->
        </div>
        <!-- /.content -->
    </div>
    <!-- /.content-wrapper -->

    <!-- Control Sidebar -->
    <aside class="control-sidebar control-sidebar-dark" style="display: none;">
        <!-- Control sidebar content goes here -->
    </aside>
    <!-- /.control-sidebar -->

    <!-- Main Footer -->
    <?php echo $__env->make('layouts.footer', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
    <form id="logout-form" action="<?php echo e(route('logout')); ?>" method="POST"
          style="display: none;">
        <?php echo csrf_field(); ?>
    </form>
</div>
<!-- ./wrapper -->

<!-- REQUIRED SCRIPTS -->
<!-- jQuery -->
<script src="<?php echo e(asset('plugins/jquery/jquery.min.js')); ?>"></script>
<!-- Popper -->
<script src="<?php echo e(asset('plugins/popper-v2/popper.min.js')); ?>"></script>
<!-- Bootstrap -->
<script src="<?php echo e(asset('plugins/bootstrap/js/bootstrap.bundle.min.js')); ?>"></script>
<!-- Select2 -->
<script src="<?php echo e(asset('plugins/select2/js/select2.full.min.js')); ?>"></script>
<!-- Bootstrap4 Duallistbox -->
<script src="<?php echo e(asset('plugins/bootstrap4-duallistbox/jquery.bootstrap-duallistbox.min.js')); ?>"></script>
<!-- InputMask -->
<script src="<?php echo e(asset('plugins/moment/moment.min.js')); ?>"></script>
<script src="<?php echo e(asset('plugins/inputmask/min/jquery.inputmask.bundle.min.js')); ?>"></script>
<!-- date-range-picker -->
<script src="<?php echo e(asset('plugins/daterangepicker/daterangepicker.js')); ?>"></script>
<!-- bootstrap color picker -->
<script src="<?php echo e(asset('plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.min.js')); ?>"></script>
<!-- Tempusdominus Bootstrap 4 -->
<script src="<?php echo e(asset('plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js')); ?>"></script>
<!-- Bootstrap Switch -->
<script src="<?php echo e(asset('plugins/bootstrap-switch/js/bootstrap-switch.min.js')); ?>"></script>
<!-- DataTables -->
<script src="<?php echo e(asset('plugins/datatables/jquery.dataTables.min.js')); ?>"></script>
<script src="<?php echo e(asset('plugins/datatables-bs4/js/dataTables.bootstrap4.min.js')); ?>"></script>
<script src="<?php echo e(asset('plugins/datatables-responsive/js/dataTables.responsive.min.js')); ?>"></script>
<script src="<?php echo e(asset('plugins/datatables-responsive/js/responsive.bootstrap4.min.js')); ?>"></script>
<!-- bs-custom-file-input -->
<script src="<?php echo e(asset('plugins/bs-custom-file-input/bs-custom-file-input.min.js')); ?>"></script>
<!-- date-range-picker -->
<script src="<?php echo e(asset('plugins/daterangepicker/daterangepicker.js')); ?>"></script>
<!-- Toastr -->
<script src="<?php echo e(asset('plugins/toastr/toastr.min.js')); ?>"></script>
<!-- AdminLTE ALWAYS LAST-->
<script src="<?php echo e(asset('asset/js/adminlte.js')); ?>"></script>
<!-- OPTIONAL SCRIPTS -->
<script src="<?php echo e(asset('asset/js/scrips.js?v=3.2')); ?>"></script>
<?php echo $__env->yieldContent('js'); ?>
<?php echo $__env->yieldPushContent('stack-js'); ?>
</body>
</html>

<?php /**PATH /home/u483135680/domains/cecics.com/public_html/cms/resources/views/layouts/master.blade.php ENDPATH**/ ?>