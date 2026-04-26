<?php $__env->startSection('title'); ?>
    CECICS - Phiếu trả #<?php echo e($return->ticket_no); ?>

<?php $__env->stopSection(); ?>

<?php $__env->startSection('page-title'); ?>
    <h3 class="m-0 text-dark">Xem mẫu phiếu in</h3>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('breadcrumb'); ?>
    <ol class="breadcrumb float-sm-right">
        <li class="breadcrumb-item"><a href="/">Home</a></li>
        <li class="breadcrumb-item"><a href="<?php echo e(route('return.detail',$return->id)); ?>">PT
                #<?php echo e($return->ticket_no); ?></a></li>
        <li class="breadcrumb-item active">In phiếu</li>
    </ol>
<?php $__env->stopSection(); ?>
<style>
    /* @media  all {
        .page-break	{ display: none; }
    } */

    .page-header p {
        font-size: 12px !important;
    }

    @media  print {
        .card-header {
            display: none;
        }

        .main-footer {
            display: none;
        }

        div.page-break {
            display: block;
            page-break-before: always;
        }

        .page-header {
            position: fixed;
            top: 0;
        }
    }
</style>

<?php $__env->startSection('action-buttons'); ?>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('content'); ?>
    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-sm-12">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-tools">
                                <a class="btn btn-sm btn-info float-left print-button"
                                ><i class="fas fa-print"></i>&nbsp;In
                                </a>
                            </div>
                        </div>

                        <div class="card-body page-break">
                            <div class="col-md-12 mb-3">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="page-header">
                                            <p><i>Ngày in: <?php echo e(date('d-m-Y')); ?></i></p>
                                        </div>
                                    </div>
                                    <div class="col-md-12 text-center">
                                        <h2>Phiếu trả</h2>
                                    </div>
                                    <div class="col-md-12 row" style="min-height:80px;">
                                        <div class="col-md-12 text-right">
                                            <p>Mã phiếu trả: <?php echo e($return->ticket_no); ?></p>
                                        </div>
                                    </div>
                                    <div class="col-md-12 row">
                                        <div class="col-md-4">
                                            <p>Họ tên người trả: <span class="text-uppercase">
                                                    <?php echo e($return->return_full_name); ?>

                                                </span></p>
                                        </div>
                                        <div class="col-md-4">
                                            <p>Bộ môn: <?php echo e($return->rental_ticket_BL->rented_department->name); ?></p>
                                        </div>
                                        <div class="col-md-4">
                                            <p>Điện thoại: <?php echo e($return->return_phone); ?></p>
                                        </div>
                                    </div>
                                    <div class="col-md-12 row">
                                        <div class="col-sm-12 col-md-12 col-xl-8">
                                            <p>Nội dung trả: <?php echo e($return->note); ?></p>
                                        </div>
                                    </div>
                                    <div class="col-md-12 row">
                                        <div class="col-sm-12 col-md-12 col-xl-8">
                                            <p>Mã phiếu mượn: <?php echo e($return->rental_ticket_BL->ticket_no); ?></p>
                                        </div>
                                    </div>
                                    <div class="col-md-12 row">
                                        <div class="col-md-3">
                                            <p>Ngày
                                                mượn: <?php echo e(date('d-m-Y', strtotime($return->rental_ticket_BL->rented_date))); ?></p>
                                        </div>
                                        <div class="col-md-3">
                                            <p>Ngày
                                                trả: <?php echo e(date('d-m-Y', strtotime($return->returned_date))); ?></p>
                                        </div>
                                    </div>
                                    <div class="col-md-12 row">
                                        <div class="col-md-12">
                                            <b><p>Chi tiết mô hình thiết bị mượn:</p></b>
                                        </div>
                                        <table id="return_table"
                                               class="table table-sm table-striped table-bordered table-hover">
                                            <thead>
                                            <tr>
                                                <th class="text-center">STT</th>
                                                <th class="text-center">Barcode-stt</th>
                                                <th class="text-center" style="width: 15%">Tên thiết bị</th>
                                                <th class="text-center">Ngày mượn</th>
                                                <th class="text-center">Tình trạng lúc mượn</th>
                                                <th class="text-center">Trạng thái</th>
                                                <th class="text-center" style="width: 15%">Ghi chú mượn</th>
                                                <th class="text-center">Ngày trả</th>
                                                <th class="text-center">Tình trạng lúc trả</th>
                                                <th class="text-center" style="width: 15%">Ghi chú trả</th>
                                            </tr>
                                            </thead>
                                            <tbody id="rental_body_table">
                                            <?php $__currentLoopData = $return->returned_items; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $idx => $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                                <tr data-id="<?php echo e($idx); ?>">
                                                    <td><?php echo e($idx+1); ?></td>
                                                    <td><?php echo e($item->rented_detail->item_info->barcode_stt); ?></td>
                                                    <td class="text-center"><?php echo e($item->rented_detail->item_info->equipment->name); ?></td>
                                                    <td class="text-center"><?php echo e(date('d-m-Y', strtotime($return->rental_ticket_BL->rented_date))); ?></td>
                                                    <td class="text-center"><?php echo e($item->rented_detail->rented_condition->name); ?></td>
                                                    <td class="text-center status"><?php echo e($item->rented_detail->item_info->equipment_status->name); ?></td>
                                                    <td class="text-center"><?php echo e($item->rented_detail->note); ?></td>
                                                    <td class="text-center"><?php echo e(date('d-m-Y', strtotime($item->created_at))); ?></td>
                                                    <td class="text-center"><?php echo e($item->returned_condition->name); ?></td>
                                                    <td class="text-center"><?php echo e($item->note); ?></td>
                                                </tr>
                                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="col-md-12 row">
                                        <div class="col-md-12 text-right">
                                            <p><i>Hồ Chí Minh,
                                                    ngày</i> <?php echo e(date('d-m-Y',strtotime($return->returned_date))); ?>

                                            </p>
                                        </div>
                                    </div>
                                    <div class="col-md-12 row">
                                        <div class="col-md-6 text-left">
                                            <div class="col-md-12">
                                                <p>Người nhận</p>
                                            </div>
                                            <div class="col-md-12" style="min-height:120px;">
                                                <p>Kí tên</p>
                                            </div>
                                            <div class="col-md-12">
                                                <p class="text-uppercase"><?php echo e($return->approved_full_name ?? Auth::user()->name); ?></p>
                                            </div>
                                        </div>
                                        <div class="col-md-6 text-right">
                                            <div class="col-md-12">
                                                <p>Người trả</p>
                                            </div>
                                            <div class="col-md-12" style="min-height:120px;">
                                                <p>Kí tên</p>
                                            </div>
                                            <div class="col-md-12">
                                                <p class="text-uppercase"><?php echo e($return->return_full_name); ?></p>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- /.card -->
                </div>
            </div>
            <!-- /.row -->
        </div>
    </section>
<?php $__env->stopSection(); ?>


<?php $__env->startSection('js'); ?>
    <script>
        $('.print-button').on('click', function (e) {
            $.ajax({
                type: 'post',
                url: '<?php echo e(route("return.confirm_return", $return->id)); ?>',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function (result) {
                    window.print();
                    if (result.message !== '') {
                        toastr.success(result.message);
                    }
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
        });
    </script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.master', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /home/u483135680/domains/cecics.com/public_html/cms/resources/views/return/print_preview.blade.php ENDPATH**/ ?>