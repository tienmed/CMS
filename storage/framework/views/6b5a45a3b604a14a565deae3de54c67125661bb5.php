<?php $__env->startSection('title'); ?>
    CECICS - Phiếu mượn #<?php echo e($rental->ticket_no); ?>

<?php $__env->stopSection(); ?>
<?php $__env->startSection('page-title'); ?>
    <h3 class="m-0 text-dark">Xem mẫu phiếu in #<?php echo e($rental->ticket_no); ?></h3>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('breadcrumb'); ?>
    <ol class="breadcrumb float-sm-right">
        <li class="breadcrumb-item"><a href="/">Home</a></li>
        <li class="breadcrumb-item"><a href="<?php echo e(route('rental.detail',$rental->id)); ?>">PM
                #<?php echo e($rental->ticket_no); ?></a></li>
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
                                        <h2>Phiếu mượn</h2>
                                    </div>
                                    <div class="col-md-12 row" style="min-height:80px;">
                                        <div class="col-md-12 text-right">
                                            <p>Mã phiếu mượn: <?php echo e($rental->ticket_no); ?></p>
                                        </div>
                                    </div>
                                    <div class="col-md-12 row">
                                        <div class="col-md-4">
                                            <p>Họ tên người mượn: <span
                                                    class="text-uppercase"><?php echo e($rental->rented_full_name); ?></span></p>
                                        </div>
                                        <div class="col-md-4">
                                            <p>Bộ môn: <?php echo e($rental->rented_department->name); ?></p>
                                        </div>
                                        <div class="col-md-4">
                                            <p>Điện thoại: <?php echo e($rental->rented_phone); ?></p>
                                        </div>
                                    </div>
                                    <div class="col-md-12 row">
                                        <div class="col-sm-12 col-md-12 col-xl-8">
                                            <p style="text-align: justify">Nội dung mượn: <?php echo e($rental->note); ?></p>
                                        </div>
                                    </div>
                                    <div class="col-md-12 row">
                                        <div class="col-md-12">
                                            <p>Hạn trả: <?php echo e(date('d-m-Y', strtotime($rental->due_date))); ?></p>
                                        </div>
                                    </div>
                                    <div class="col-md-12 row">
                                        <div class="col-md-12">
                                            <b><p>Chi tiết mô hình thiết bị mượn:</p></b>
                                        </div>
                                        <div class="table-responsive">
                                            <table id="rental_table"
                                                   class="table table-sm table-striped table-bordered table-hover">
                                                <thead>
                                                <tr>
                                                    <th class="text-center">STT</th>
                                                    <th class="text-center">Barcode-stt</th>
                                                    <th class="text-center">Tên thiết bị</th>
                                                    <th class="text-center">Ngày mượn</th>
                                                    <th class="text-center">Tình trạng lúc mượn</th>
                                                    <th class="text-center">Trạng thái</th>
                                                    <th class="text-center">Ghi chú mượn</th>
                                                </tr>
                                                </thead>
                                                <tbody id="rental_body_table">
                                                <?php $__currentLoopData = $rental->items; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $idx => $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                                    <tr data-id="<?php echo e($idx); ?>">
                                                        <td><?php echo e($idx+1); ?></td>
                                                        <td><?php echo e($item->item_info->barcode_stt); ?></td>
                                                        <td class="text-center"><?php echo e($item->item_info->equipment->name); ?></td>
                                                        <td class="text-center"><?php echo e(date('d-m-Y', strtotime($rental->rented_date))); ?></td>
                                                        <td class="text-center"><?php echo e($item->rented_condition->name); ?></td>
                                                        <td class="text-center status"><?php echo e($item->item_info->equipment_status->name); ?></td>
                                                        <td class="text-center"><?php echo e($item->note); ?></td>
                                                    </tr>
                                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div class="col-md-12 row">
                                        <div class="col-md-12 text-right">
                                            <p><i>Hồ Chí Minh,
                                                    ngày</i> <?php echo e(date('d-m-Y',strtotime($rental->rented_date))); ?></p>
                                        </div>
                                    </div>
                                    <div class="col-md-12 row">
                                        <div class="col-md-6 text-left">
                                            <div class="col-md-12">
                                                <p>Người cho mượn</p>
                                            </div>
                                            <div class="col-md-12" style="min-height:120px;">
                                                <p>Kí tên</p>
                                            </div>
                                            <div class="col-md-12">
                                                <p class="text-uppercase"><?php echo e($rental->approved_full_name ?? Auth::user()->name); ?></p>
                                            </div>
                                        </div>
                                        <div class="col-md-6 text-right">
                                            <div class="col-md-12">
                                                <p>Người mượn</p>
                                            </div>
                                            <div class="col-md-12" style="min-height:120px;">
                                                <p>Kí tên</p>
                                            </div>
                                            <div class="col-md-12">
                                                <p class="text-uppercase"><?php echo e($rental->rented_full_name); ?></p>
                                            </div>
                                        </div>
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
        $('.print-button').on('click', function (e) {
            $.ajax({
                type: 'post',
                url: '<?php echo e(route("rental.confirm_rental", $rental->id)); ?>',
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

<?php echo $__env->make('layouts.master', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /home/u483135680/domains/cecics.com/public_html/cms/resources/views/rental/print_preview.blade.php ENDPATH**/ ?>