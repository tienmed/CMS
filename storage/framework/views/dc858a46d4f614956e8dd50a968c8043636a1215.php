<?php $__env->startSection('page-title'); ?>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('breadcrumb'); ?>
    <ol class="breadcrumb float-sm-right">
        <li class="breadcrumb-item"><a href="/">Trang chủ</a></li>
        <li class="breadcrumb-item active">Danh sách tình trạng</li>
    </ol>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('content'); ?>
    <section class="content">
        <div class="container-fluid">
            <div class="card">

                <div class="card-body">
                    <div class="row">

                        <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check("Tạo tình trạng")): ?>
                            <div class="col-md-12 mb-3">
                                <div class="card card-create-condition">
                                    <div class="card-body">
                                        <div class="col-md-12">
                                            <h5>Tạo tình trạng mới</h5>
                                        </div>
                                        <form action="<?php echo e(route('condition.create')); ?>"
                                              method="post" id="condition_creation_form">
                                            <?php echo csrf_field(); ?>
                                            <div class="row">
                                                <div class="col-sm-6 col-md-3">
                                                    <div class="form-group">
                                                        <label for="name">Tên tình trạng</label>
                                                        <input type="text"
                                                               class="form-control form-control-sm"
                                                               id="name" name="name"
                                                               placeholder="Nhập Tình trạng mới"
                                                        >
                                                    </div>
                                                </div>
                                                <div class="col-sm-6 col-md-2">
                                                    <div class="form-group">
                                                        <label for="bg_color">Màu Nền</label>
                                                        <div class="input-group bg_color_picker">
                                                            <input type="text"
                                                                   class="form-control form-control-sm"
                                                                   name="bg_color" id="bg_color"
                                                                   value="#ffffff">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-sm-6 col-md-2">
                                                    <div class="form-group">
                                                        <label for="font_color">Màu chữ</label>
                                                        <div class="input-group font_color_picker">
                                                            <input type="text"
                                                                   class="form-control form-control-sm"
                                                                   name="font_color" id="font_color"
                                                                   value="#000000">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-sm-6 col-md-3">
                                                    <div class="form-group form-control-sm">
                                                        <label>Xem trước</label>
                                                        <div>
                                                    <span class="badge show-bg-color">
                                                        <span class="show-font-color">
                                                            Mẫu
                                                        </span>
                                                    </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-sm-2 col-md-2">
                                                    <div class="form-group">
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
                                <h5>Danh sách tình trạng</h5>
                            </div>
                            <table id="condition_table"
                                   class="table table-sm table-striped table-bordered table-hover">
                                <thead>
                                <tr>
                                    <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check("Sửa tình trạng")): ?>
                                        <th class="text-center" style="width: 10%">
                                            Action
                                        </th>
                                    <?php endif; ?>
                                    <th>Tên</th>
                                </tr>
                                </thead>
                                <tbody>
                                <?php $__currentLoopData = $conditions; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $condition): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                    <tr class="row-item">
                                        <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check("Sửa tình trạng")): ?>
                                            <td class="button-column">
                                                <a class="btn btn-xs btn-outline-warning"
                                                   href="<?php echo e(route('condition.edit',$condition->id)); ?>"
                                                ><i class="fas fa-edit"></i> Sửa
                                                </a>
                                            </td>
                                        <?php endif; ?>
                                        <td>
                                            <?php if(empty($condition->bg_color)): ?>
                                                <span>
                                                    <?php echo e($condition->name); ?>

                                                </span>
                                            <?php else: ?>
                                                <span class='badge'
                                                      style="background-color: <?php echo e('#'. $condition->bg_color); ?> !important;
                                                          color: <?php echo e('#'.$condition->font_color); ?> !important;">
                                                    <?php echo e($condition->name); ?>

                                                </span>
                                            <?php endif; ?>
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
        $('#condition_table').DataTable({
            "paging": false,
            "lengthChange": false,
            "searching": false,
            "ordering": false,
            "info": false,
            "autoWidth": false,
            "responsive": true,
        });

        <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check("Tạo tình trạng")): ?>
        //bg_color_picker
        $('.bg_color_picker').colorpicker()
        $('.bg_color_picker').on('colorpickerChange', function (event) {
            $('.show-bg-color').css('background-color', event.color.toString());
        });

        //font_color_picker
        $('.font_color_picker').colorpicker()
        $('.font_color_picker').on('colorpickerChange', function (event) {
            $('.show-font-color').css('color', event.color.toString());
        });

        var condition_row_template = $('' +
            '<tr class="row-item">' +
            '   <td class="button-column">' +
            '       <a class="btn btn-xs btn-outline-warning" href="">' +
            '           <i class="fas fa-edit"></i> Sửa' +
            '       </a>' +
            '   </td>' +
            '   <td><span class="badge"></span></td>' +
            '</tr>');
        $('#condition_creation_form').on("submit", function (e) {
            e.preventDefault();
            $('.spinner-border-saving').css('display', 'inline-block');
            $.ajax({
                type: 'post',
                url: "<?php echo e(route('condition.create')); ?>",
                data: $(this).serialize(),
                success: function (result) {
                    var new_condition_row = condition_row_template.clone();
                    new_condition_row.find("td:eq(0) > a").attr("href", "/condition/edit/" + result.data["id"]);
                    new_condition_row.find("td:eq(1) > span").html(result.data["name"]);
                    new_condition_row.find("td:eq(1) > span").css('color', '#' + result.data["font_color"]);
                    new_condition_row.find("td:eq(1) > span").css('background-color', '#' + result.data["bg_color"]);
                    $("#condition_table > tbody").append(new_condition_row);
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

<?php echo $__env->make('layouts.master', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /home/u483135680/domains/cecics.com/public_html/cms/resources/views/condition/index.blade.php ENDPATH**/ ?>