<?php $__env->startSection('breadcrumb'); ?>
    <ol class="breadcrumb float-sm-right">
        <li class="breadcrumb-item"><a href="/">Home</a></li>
        <li class="breadcrumb-item active">Lịch sử truy cập</li>
    </ol>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('content'); ?>
    <section class="content">
        <div class="container-fluid">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Lịch sử truy cập</h3>
                </div>
                <div class="card-body">
                    <div class="col-md-12">
                        <table id="user_table"
                               class="table table-sm table-striped table-bordered table-hover">
                            <thead>
                            <tr>
                                <th>Tên</th>
                                <th>IP</th>
                                <th>Sự kiện</th>
                            </tr>
                            </thead>
                            <tbody>
                            <?php $__currentLoopData = $user_logs; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $log): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                <tr class="row-item">
                                    <td><?php echo e($log->user->name); ?></td>
                                    <td><?php echo e($log->ip); ?></td>
                                    <td><?php echo e($log->event); ?></td>
                                </tr>
                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                            </tbody>
                        </table>
                        <div class="row">
                            <div class="col-sm-12 col-md-5"></div>
                            <div class="col-sm-12 col-md-7">
                                <div class="dataTables_wrapper m-2">
                                    <div class="dataTables_paginate paging_simple_numbers">
                                        <?php echo $user_logs->render(); ?>

                                    </div>
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

        $(function () {
            $('#user_table').DataTable({
                "paging": false,
                "lengthChange": false,
                "searching": false,
                "ordering": false,
                "info": false,
                "autoWidth": false,
                "responsive": true,
            });
        });
    </script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.master', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /home/u483135680/domains/cecics.com/public_html/cms/resources/views/user_logs/index.blade.php ENDPATH**/ ?>