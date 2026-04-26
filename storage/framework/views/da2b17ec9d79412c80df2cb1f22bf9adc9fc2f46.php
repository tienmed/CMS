<?php $__env->startSection('page-title'); ?>
    <h3 class="m-0 text-dark">Chi tiết phiếu trả</h3>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('breadcrumb'); ?>
    <ol class="breadcrumb float-sm-right">
        <li class="breadcrumb-item"><a href="/">Home</a></li>
        <li class="breadcrumb-item"><a href="<?php echo e(route('rental.detail', $return->rental_ticket_BL->id)); ?>">PM
                # <?php echo e($return->rental_ticket_BL->ticket_no); ?></a></li>
        <li class="breadcrumb-item active">Chi tiết phiếu trả</li>
    </ol>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('action-buttons'); ?>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('content'); ?>
    <form action="<?php echo e(route('return.update')); ?>" method="patch" id="form_return" class="form-horizontal">
        <?php echo csrf_field(); ?>
        <section class="content">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm-12">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">Phiếu trả #<?php echo e($return->ticket_no); ?></h3>
                                <div class="card-tools">
                                    <a class="btn btn-sm btn-info float-left print-button"
                                       href="<?php echo e(route('return.print_preview', $return->id)); ?>"
                                    ><i class="fas fa-print"></i>&nbsp;In
                                    </a>
                                    <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check("Sửa phiếu trả")): ?>
                                        <a class="btn btn-sm btn-info"
                                           href="<?php echo e(route('return.edit', $return->id)); ?>"
                                        ><i class="fas fa-pen"></i>&nbsp;Chỉnh sửa
                                        </a>
                                    <?php endif; ?>
                                </div>
                            </div>

                            <div class="card-body">
                                
                                <div class="col-md-12 mb-3">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <h4>Nội dung phiếu mượn</h4>
                                        </div>
                                        <div class="col-md-12 row">
                                            <div class="col-sm-12 col-md-3 col-xl-3">
                                                <div class="form-group">
                                                    <label for="rental_ticket">Phiếu mượn</label>
                                                    <input type="text"
                                                           class="form-control form-control-sm rental_ticket"
                                                           name="rental_ticket" id="rental_ticket"
                                                           value="<?php echo e($return->rental_ticket_BL->ticket_no); ?>" readonly>
                                                    <div class="help-block"></div>
                                                </div>
                                            </div>
                                            <div class="col-sm-12 col-md-3 col-xl-3">
                                                <div class="form-group">
                                                    <label for="department">Bộ môn mượn</label>
                                                    <input type="text" class="form-control form-control-sm"
                                                           name="department" id="department"
                                                           value="<?php echo e($return->rental_ticket_BL->rented_department->name); ?>"
                                                           readonly>
                                                    <div class="help-block"></div>
                                                </div>
                                            </div>
                                            <div class="col-sm-12 col-md-3 col-xl-3">
                                                <div class="form-group">
                                                    <label for="rented_date">Ngày mượn</label>
                                                    <input type="text" class="form-control form-control-sm"
                                                           name="rented_date" id="rented_date"
                                                           value="<?php echo e(date('d-m-Y', strtotime($return->rental_ticket_BL->rented_date))); ?>"
                                                           readonly>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-12">
                                            <h4>Nội dung phiếu trả</h4>
                                        </div>
                                        <div class="col-md-12 row">
                                            <div class="col-sm-12 col-md-3 col-xl-3">
                                                <div class="form-group">
                                                    <label for="approved_full_name">Người nhận</label>
                                                    <input type="text"
                                                           class="form-control form-control-sm approved_full_name"
                                                           name="approved_full_name" id="approved_full_name"
                                                           value="<?php echo e($return->approved_full_name); ?>" readonly>
                                                    <div class="help-block"></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-md-12 row">
                                            <div class="col-sm-12 col-md-3 col-xl-3">
                                                <div class="form-group">
                                                    <label for="return_full_name">Người trả</label>
                                                    <input type="text"
                                                           class="form-control form-control-sm return_full_name"
                                                           name="return_full_name" id="return_full_name"
                                                           value="<?php echo e($return->return_full_name); ?>" readonly>
                                                    <div class="help-block"></div>
                                                </div>
                                            </div>
                                            <div class="col-sm-12 col-md-3 col-xl-3">
                                                <div class="form-group">
                                                    <label for="return_phone">Số điện thoại</label>
                                                    <input type="text" class="form-control form-control-sm return_phone"
                                                           name="return_phone" id="return_phone"
                                                           value="<?php echo e($return->return_phone); ?>" readonly>
                                                    <div class="help-block"></div>
                                                </div>
                                            </div>
                                            <div class="col-sm-12 col-md-3 col-xl-3">
                                                <div class="form-group">
                                                    <label for="returned_date">Ngày trả</label>
                                                    <input type="text" class="form-control form-control-sm"
                                                           name="returned_date" id="returned_date"
                                                           value="<?php echo e(date('d-m-Y', strtotime($return->returned_date))); ?>"
                                                           readonly>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-12 row">
                                            <div class="col-sm-12 col-md-6 col-xl-6">
                                                <label for="note">Nội dung trả</label>
                                                <textarea class="form-control form-control-sm"
                                                          id="note" name="note"
                                                          rows="4"
                                                          readonly
                                                ><?php echo e($return->note); ?></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-12 return-list mb-3">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <h4>Danh sách mô hình / thiết bị</h4>
                                        </div>
                                        <div class="col-md-12">
                                            <div class="table-responsive">
                                                <table id="return_table"
                                                       class="table table-sm table-striped table-bordered table-hover">
                                                    <thead>
                                                    <tr>
                                                        <th class="text-center">Barcode-stt</th>
                                                        <th class="text-center" style="width: 15%">Tên thiết bị</th>
                                                        <th class="text-center">Ngày mượn</th>
                                                        <th class="text-center">Tình trạng lúc mượn</th>
                                                        <th class="text-center">Trạng thái</th>
                                                        <th class="text-center">Ngày trả</th>
                                                        <th class="text-center">Tình trạng lúc trả</th>
                                                        <th class="text-center" style="width: 25%">Ghi chú</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <?php $__currentLoopData = $return->returned_items; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $idx => $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                                        <tr data-id="<?php echo e($idx); ?>">
                                                            <td><?php echo e($item->rented_detail->item_info->barcode_stt); ?></td>
                                                            <td class="text-center"><?php echo e($item->rented_detail->item_info->equipment->name); ?></td>
                                                            <td class="text-center"><?php echo e(date('d-m-Y', strtotime($return->rental_ticket_BL->rented_date))); ?></td>
                                                            <td class="text-center"><?php echo e($item->rented_detail->rented_condition->name); ?></td>
                                                            <td class="text-center status"><?php echo e($item->rented_detail->item_info->equipment_status->name); ?></td>
                                                            <td class="text-center"><?php echo e(date('d-m-Y', strtotime($item->created_at))); ?></td>
                                                            <td class="text-center"><?php echo e($item->returned_condition->name); ?></td>
                                                            <td class="text-center"><?php echo e($item->note); ?></td>
                                                        </tr>
                                                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
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
    </form>
<?php $__env->stopSection(); ?>


<?php $__env->startSection('js'); ?>
    <script>
        // Initialize DatatTable Elements
        $('#return_table').DataTable({
            "paging": false,
            "lengthChange": false,
            "searching": false,
            "ordering": false,
            "info": false,
            "autoWidth": false,
            "responsive": true,
        });

        const d = new Date();
        const strDate = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();

        function start_return() {
            $('.return_checkbox').prop('disabled', false);
            $('.return_condition').prop('disabled', false);
            $('.return_date').val(strDate);
            $('.status').html("Kho")
        }

        $('.return_checkbox').on('change', function (e) {
            if ($(this).is(':checked')) {
                // Is Checked
                let parentElement = $(this).parent().parent();
                parentElement.find('.return_condition').prop('disabled', false);
                parentElement.find('.return_date').val(strDate);
                parentElement.find('.status').html("Kho");
            } else {
                // Remove Checked
                let parentElement = $(this).parent().parent();
                parentElement.find('.return_condition').prop('disabled', true);
                parentElement.find('.return_date').val("");
                parentElement.find('.status').html("");
            }
        });

        $('#form_return').on("submit", function (e) {
            e.preventDefault();
            var data = $(this).serializeArray();
            data.push({name: 'id', value: <?php echo e($return->id); ?>});
            $.ajax({
                type: 'patch',
                url: '<?php echo e(route("return.update")); ?>',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data: data,
                success: function (result) {
                    req_success = result.code == 200 || result.code == 201
                    if (req_success) {
                        msg = result.message;
                        toastr.success(msg);
                    } else {
                        for (var key in result.message) {
                            if (result.message.hasOwnProperty(key)) {
                                toastr.warning(result.message[key][0]);
                            }
                        }

                    }
                }
            });
            return false;
        });
    </script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.master', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /home/u483135680/domains/cecics.com/public_html/cms/resources/views/return/detail.blade.php ENDPATH**/ ?>