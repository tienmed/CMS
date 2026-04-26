<?php $__env->startSection('page-title'); ?>
    <h3 class="m-0 text-dark">Danh sách bộ môn</h3>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('breadcrumb'); ?>
    <ol class="breadcrumb float-sm-right">
        <li class="breadcrumb-item"><a href="/">Home</a></li>
        <li class="breadcrumb-item active">Danh sách bộ môn</li>
    </ol>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('content'); ?>
    <section class="content">
        <div class="container-fluid">
            <div class="card">
                <div class="card-body">
                    <div class="row">

                        <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check("Tạo bộ môn")): ?>
                            <div class="col-md-12 mb-3">
                                <div class="card card-create-department">
                                    <div class="card-body">
                                        <div class="col-md-12">
                                            <h5>Tạo bộ môn mới</h5>
                                        </div>
                                        <form action="<?php echo e(route('department.create')); ?>"
                                              method="post" id="department_creation_form">
                                            <?php echo csrf_field(); ?>
                                            <div class="row">
                                                <div class="col-sm-6 col-md-3">
                                                    <div class="form-group form-group-sm">
                                                        <label for="department">Tên bộ môn</label>
                                                        <input type="text"
                                                               class="form-control form-control-sm"
                                                               id='department' name="department"
                                                               placeholder="Nhập tên bộ môn mới">
                                                    </div>
                                                </div>
                                                <div class="col-sm-2 col-md-2">
                                                    <div class="form-group form-group-sm">
                                                        <button type="submit" style="margin-top: 25px;"
                                                                class="btn btn-sm btn-outline-info">
                                                        <span
                                                            class="spinner-border-saving spinner-border spinner-border-sm text-info"
                                                            role="status" style="display: none;">
                                                                <span class="sr-only">Loading...</span>
                                                        </span>
                                                            Tạo mới
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        <?php endif; ?>

                        <div class="col-md-12">
                            <div class="col-md-12">
                                <h5>Danh sách bộ môn</h5>
                            </div>
                            <table id="department_table"
                                   class="table table-sm table-striped table-bordered table-hover">
                                <thead>
                                <tr>
                                    <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check("Sửa bộ môn")): ?>
                                        <th class="text-center"
                                            style="width: 10%">
                                            Action
                                        </th>
                                    <?php endif; ?>
                                    <th>Tên</th>
                                </tr>
                                </thead>
                                <tbody>
                                <?php $__currentLoopData = $departments; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $department): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                    <tr class="row-item">
                                        <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check("Sửa bộ môn")): ?>
                                            <td class="button-column">
                                                <a class="btn btn-xs btn-outline-warning"
                                                   href="<?php echo e(route('department.edit',$department->id)); ?>"
                                                ><i class="fas fa-edit"></i> Sửa
                                                </a>
                                            </td>
                                        <?php endif; ?>
                                        <td>
                                            <span><?php echo e($department->name); ?></span>
                                        </td>
                                    </tr>
                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </section>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('js'); ?>
    <script>
        $('#department_table').DataTable({
            "paging": false,
            "lengthChange": false,
            "searching": false,
            "ordering": false,
            "info": false,
            "autoWidth": false,
            "responsive": true,
        });

        <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check("Tạo bộ môn")): ?>
        var department_row_template = $('' +
            '<tr class="row-item">' +
            '   <td class="button-column">' +
            '       <a class="btn btn-xs btn-outline-warning" href="">' +
            '           <i class="fas fa-edit"></i> Sửa' +
            '       </a>' +
            '   </td>' +
            '   <td><span></span></td>' +
            '</tr>');
        $('#department_creation_form').on("submit", function (e) {
            e.preventDefault();
            $('.spinner-border-saving').css('display', 'inline-block');
            $.ajax({
                type: 'post',
                url: '<?php echo e(route("department.create")); ?>',
                data: $(this).serialize(),
                success: function (result) {
                    var new_department_row = department_row_template.clone();
                    new_department_row.find("td:eq(0) > a").attr("href", "/department/edit/" + result.data["id"]);
                    new_department_row.find("td:eq(1) > span").html(result.data["name"]);
                    $("#department_table > tbody").append(new_department_row);
                    toastr.success(result.message);
                },
                error: function (request, status, error) {
                    let msg = 'Đã xảy ra lỗi, vui lòng thử lại hoặc liên hệ với quản trị viên của bạn.';
                    if (request.responseText != null) {
                        let responseData = JSON.parse(request.responseText);
                        if ('errors' in responseData) {
                            $.each(responseData.errors, (value) => {
                                msg = responseData.errors[value][0];
                                return false;
                            });
                        } else {
                            msg = responseData.message;
                        }
                    }
                    toastr.warning(msg);
                },
            });
            $('.spinner-border-saving').css('display', 'none');
        });
        <?php endif; ?>
    </script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.master', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /home/u483135680/domains/cecics.com/public_html/cms/resources/views/department/index.blade.php ENDPATH**/ ?>