<?php $__env->startSection('breadcrumb'); ?>
    <ol class="breadcrumb float-sm-right">
        <li class="breadcrumb-item"><a href="/">Home</a></li>
        <li class="breadcrumb-item active">Danh sách tài khoản</li>
    </ol>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('content'); ?>
    <section class="content">
        <div class="container-fluid">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Danh sách tài khoản</h3>
                    <div class="card-tools">
                        <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check("Tạo tài khoản")): ?>
                            <a class="btn btn-sm btn-outline-primary"
                               href="<?php echo e(route('user.add')); ?>">
                                Thêm tài khoản
                            </a>
                        <?php endif; ?>
                    </div>
                </div>
                <div class="card-body">
                    <div class="col-md-12">
                        <table id="user_table"
                               class="table table-sm table-striped table-bordered table-hover">
                            <thead>
                            <tr>
                                <th class="text-center" style="width: 10%">
                                    Action
                                </th>
                                <th>Tên</th>
                                <th>Username</th>
                                <th>Bộ môn</th>
                                <th>Phân quyền</th>
                            </tr>
                            </thead>
                            <tbody>
                            <?php $__currentLoopData = $users; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $user): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                <tr class="row-item">
                                    <td class="button-column">
                                        <a class="btn btn-xs btn-outline-warning"
                                           href="<?php echo e(route('user.edit',$user->id)); ?>"
                                        ><i class="fas fa-edit"></i> Sửa
                                        </a>
                                    </td>
                                    <td><?php echo e($user->name); ?></td>
                                    <td><?php echo e($user->username); ?></td>
                                    <td><?php echo e($user->department->name); ?></td>
                                    <td> <?php echo e($user->roles()->pluck('name')->implode(', ')); ?> </td>
                                </tr>
                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                            </tbody>
                        </table>
                        <div class="row">
                            <div class="col-sm-12 col-md-5"></div>
                            <div class="col-sm-12 col-md-7">
                                <div class="dataTables_wrapper m-2">
                                    <div class="dataTables_paginate paging_simple_numbers">
                                        <?php echo $users->render(); ?>

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

<?php echo $__env->make('layouts.master', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /home/u483135680/domains/cecics.com/public_html/cms/resources/views/users/index.blade.php ENDPATH**/ ?>