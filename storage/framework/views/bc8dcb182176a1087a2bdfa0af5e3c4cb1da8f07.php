<?php $__env->startSection('title','CECICS - Chỉnh sửa barcode-stt'); ?>

<?php $__env->startSection('page-title'); ?>

<?php $__env->stopSection(); ?>

<?php $__env->startSection('breadcrumb'); ?>
    <ol class="breadcrumb float-sm-right">
        <li class="breadcrumb-item"><a href="/">Trang chủ</a></li>
        <li class="breadcrumb-item"><a href="<?php echo e(route('equipment.index')); ?>">Danh sách Barcode</a></li>
        <li class="breadcrumb-item"><a
                href="<?php echo e(route('equipment.edit', $item->equipment->id)); ?>"><?php echo e($item->equipment->barcode); ?></a></li>
        <li class="breadcrumb-item active"><?php echo e($item->barcode_stt); ?></li>
    </ol>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('content'); ?>

    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Chỉnh sửa thiết bị</h3>
                            <div class="card-tools">
                                <button type="submit"
                                        form="equipment_item_update_form"
                                        class="btn btn-sm btn-outline-info float-left">
                                    <span class="spinner-border-saving spinner-border spinner-border-sm text-info"
                                          role="status" style="display: none;">
                                            <span class="sr-only">Loading...</span>
                                    </span>
                                    Lưu
                                </button>

                            </div>
                        </div>
                        <div class="card-body">
                            <div class="equipment-item-information">
                                <div class="row">
                                    <div class="col-md-12">
                                        <h5>Thông tin chung</h5>
                                    </div>
                                    <form id="equipment_item_update_form"
                                          action="<?php echo e(route('equipment_item.update')); ?>" method="patch">
                                        <?php echo csrf_field(); ?>
                                        <input hidden type="text" name="id" value="<?php echo e($item->id); ?>">
                                        <div class="col-md-12">
                                            <div class="row">
                                                <div class="col-sm-6 col-md-3 col-xl-3">
                                                    <div class="form-group">
                                                        <label for="barcode">Barcode mô hình - thiết bị</label>
                                                        <input type="text" id="barcode" name="barcode"
                                                               class="form-control form-control-sm"
                                                               value="<?php echo e(old('barcode',$item->equipment->barcode)); ?>"
                                                               readonly>
                                                    </div>
                                                </div>
                                                <div class="col-sm-6 col-md-3 col-xl-3">
                                                    <div class="form-group">
                                                        <label for="product_name">Tên mô hình - thiết bị</label>
                                                        <textarea id="product_name" name="product_name"
                                                                  class="form-control form-control-sm" rows="1"
                                                                  placeholder="Ghi chú thông tin barcode-stt..."
                                                                  readonly
                                                        ><?php echo e(old('product_name',$item->equipment->name)); ?></textarea>
                                                    </div>
                                                </div>
                                                <div class="col-sm-6 col-md-3 col-xl-3">
                                                    <div class="form-group">
                                                        <label for="stt">STT</label>
                                                        <input type="number" id="stt" name="stt"
                                                               class="form-control form-control-sm"
                                                               value="<?php echo e(old('stt',$item->stt)); ?>"
                                                               readonly
                                                               placeholder="Stt number">
                                                    </div>
                                                </div>
                                                <div class="col-sm-6 col-md-3 col-xl-3">
                                                    <div class="form-group">
                                                        <label for="barcode_stt">Barcode-stt</label>
                                                        <input type="text" id="barcode_stt" name="barcode_stt"
                                                               class="form-control form-control-sm"
                                                               value="<?php echo e(old('barcode_stt',$item->barcode_stt)); ?>"
                                                               readonly>
                                                    </div>
                                                </div>
                                                <div class="col-sm-6 col-md-3 col-xl-3">
                                                    <div class="form-group">
                                                        <label for="condition">Tình trạng</label>
                                                        <select id="condition" name="condition"
                                                                class="form-control custom-select custom-select-sm ">
                                                            <?php $__currentLoopData = $conditions; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $condition): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                                                <option value="<?php echo e($condition->id); ?>"
                                                                    <?php echo e(old('condition',$item->condition_id) == $condition->id ? 'selected' : ''); ?>>
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
                                                                class="form-control custom-select custom-select-sm">
                                                            <?php $__currentLoopData = $statuses; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $status): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                                                <option value="<?php echo e($status->id); ?>"
                                                                    <?php echo e(old('status',$item->equipment_status_id) == $status->id ? 'selected' : ''); ?>>
                                                                    <?php echo e($status->name); ?>

                                                                </option>
                                                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-sm-12 col-md-12 col-xl-12">
                                                    <div class="form-group">
                                                        <label for="note">Ghi Chú</label>
                                                        <textarea id="note" name="note"
                                                                  class="form-control form-control-sm" rows="4"
                                                                  placeholder="Ghi chú thông tin barcode_stt..."
                                                        ><?php echo e(old('note',$item->note)); ?></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check("Xem danh sách phiếu mượn")): ?>
                                <div class="equipment-rentel-table">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <h5>Lịch sử cho mượn</h5>
                                            <?php if($item->rented_history->count() > 0): ?>
                                                <div class="table-responsive">
                                                    <table id="equipment_item_table"
                                                           class="table table-sm table-striped table-bordered">
                                                        <thead>
                                                        <tr>
                                                            <th>Phiếu mượn</th>
                                                            <th>Bộ môn mượn</th>
                                                            <th>Ngày mượn</th>
                                                            <th>Tình trạng lúc mượn</th>
                                                            <th>Ngày trả</th>
                                                            <th>Tình trạng lúc trả</th>
                                                            <th>Ngày dùng</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        <?php $__currentLoopData = $item->rented_history; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $rented): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                                            <tr class="row-item">
                                                                <?php
                                                                    $rented_date = date('d-m-Y' , strtotime($rented->rental_ticket->rented_date));
                                                                    $completed_date = !empty($rented->returned_detail) ? date('d-m-Y' , strtotime($rented->returned_detail->return_date)) : '';
                                                                    $return_condition = !empty($rented->returned_detail) ? $rented->returned_detail->returned_condition->name : '';
                                                                    $date_diff = !empty($rented->returned_detail) ? (new DateTime($rented->rental_ticket->rented_date))->diff(new DateTime($rented->returned_detail->return_date))->days : '';
                                                                ?>
                                                                <td>
                                                                    <a href="<?php echo e(route('rental.detail',$rented->rental_ticket->id)); ?>"
                                                                       title="Chi tiết phiếu mượn"
                                                                    ><?php echo e($rented->rental_ticket->ticket_no); ?></a>
                                                                </td>
                                                                <td><?php echo e($rented->rental_ticket->rented_department->name); ?></td>
                                                                <td><?php echo e($rented_date); ?></td>
                                                                <td><?php echo e($rented->rented_condition->name); ?></td>
                                                                <td><?php echo e($completed_date); ?></td>
                                                                <td><?php echo e($return_condition); ?></td>
                                                                <td><?php echo e($date_diff); ?></td>
                                                            </tr>
                                                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            <?php else: ?>
                                                Barcode-stt này chưa có lịch sử mượn
                                            <?php endif; ?>
                                        </div>
                                    </div>
                                </div>
                            <?php endif; ?>

                        </div>
                        <div class="card-footer">
                            <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check("Xóa barcode-stt")): ?>
                                <a class="btn btn-sm btn-outline-danger float-right"
                                   data-toggle="confirmation"
                                   href="<?php echo e(route("equipment_item.delete", $item->id)); ?>"
                                ><i class="fas fa-close"></i> Xóa
                                </a>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('js'); ?>
    <script src="<?php echo e(asset('plugins/Bootstrap-Confirmation-master/bootstrap-confirmation.min.js')); ?>"></script>
    <script>
        $('[data-toggle=confirmation]').confirmation({
            btnOkClass: 'btn btn-sm btn-success',
            btnCancelClass: 'btn btn-sm btn-danger',
            title: 'Bạn đã chắc chưa?'
        });

        $('#barcode_stt_table').DataTable({
            "paging": false,
            "lengthChange": false,
            "searching": false,
            "ordering": false,
            "info": false,
            "autoWidth": false,
            "responsive": true,
        });

        $("input#stt").on('input', function () {
            $("input#barcode_stt").val($("input#barcode").val() + "-" + $(this).val());
        });
        $('#equipment_item_update_form').on("submit", function (e) {
            e.preventDefault();
            $('.spinner-border-saving').css('display', 'inline-block');
            var data = $(this).serializeArray();
            $.ajax({
                type: 'patch',
                url: '<?php echo e(route("equipment_item.update")); ?>',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data: data,
                success: function (result) {
                    if (result.code == 200 || result.code == 201) {
                        saved = true;
                        toastr.success(result.message);
                    } else {
                        toastr.warning('Đã xảy ra lỗi, vui lòng thử lại hoặc liên hệ với quản trị viên của bạn');
                    }
                    $('.spinner-border-saving').css('display', 'none');
                },
                error: function (request, status, error) {
                    let msg = 'Đã xảy ra lỗi, vui lòng thử lại hoặc liên hệ với quản trị viên của bạn';
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
                    $('.spinner-border-saving').css('display', 'none');
                    saved = false;
                },
            });
            return false;
        });
    </script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.master', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /home/u483135680/domains/cecics.com/public_html/cms/resources/views/equipment_item/edit.blade.php ENDPATH**/ ?>