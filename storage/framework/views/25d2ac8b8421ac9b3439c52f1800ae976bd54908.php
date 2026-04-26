<?php $__env->startSection('page-title'); ?>
    <h3 class="m-0 text-dark">Tạo phiếu trả</h3>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('breadcrumb'); ?>
    <ol class="breadcrumb float-sm-right">
        <li class="breadcrumb-item"><a href="/">Home</a></li>
        <li class="breadcrumb-item"><a href="<?php echo e(route('rental.detail', $rental->id)); ?>">PM
                # <?php echo e($rental->ticket_no); ?></a></li>
        <li class="breadcrumb-item active">Nội dung phiếu trả</li>
    </ol>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('content'); ?>
    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-sm-12">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-tools">
                                <a class="btn btn-sm btn-info float-left return"
                                   onclick="start_return()"
                                ><i class="fas fa-exchange-alt"></i>&nbsp;Trả
                                </a>
                                <button type="submit" form="form_product"
                                        class="btn btn-sm btn-info
                                        float-left save-button"
                                ><i class="fas fa-save"></i>&nbsp;Lưu
                                </button>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class=" col-md-12">
                                <div class="row">
                                    <form id="form_product"
                                          action="<?php echo e(route('return.store', $rental->id)); ?>" method="POST">
                                        <?php echo csrf_field(); ?>
                                        <?php echo $__env->make('return.formPartial', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                    </form>
                                </div>
                            </div>

                        </div>
                        <div class="card-footer">
                            <div class="text-center">
                                <button type="submit" form="form_product"
                                        class="btn btn-sm btn-outline-success">
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                    <!-- /.card -->
                </div>
            </div>
            <!-- /.row -->
        </div>
    </section>
    <!-- /.content -->
<?php $__env->stopSection(); ?>


<?php $__env->startSection('js'); ?>
    <script>
        $('#returned_date').daterangepicker({
            timePicker: false,
            singleDatePicker: true,
            locale: {
                format: 'DD-MM-YYYY'
            }
        });

        const d = new Date();
        const strDate = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();

        function start_return() {
            $('.return_checkbox').prop('disabled', false);
            $('.return_condition').prop('disabled', true);
            $('.return_item_note').prop('disabled', true);
            $('.barcode_stt_modal').prop('disabled', false);
            $('.return_date').val(strDate);
            $('.status').html("Kho")
            $('#barcode_stt_modal').focus();
        };

        $('.return_checkbox').on('change', function (e) {
            if ($(this).is(':checked')) {
                // Is Checked
                let parentElement = $(this).parent().parent();
                parentElement.find('.return_condition').prop('disabled', false);
                parentElement.find('.return_item_note').prop('disabled', false);
                parentElement.find('.return_date').val(strDate);
                parentElement.find('.status').html("Kho");
            } else {
                // Remove Checked
                let parentElement = $(this).parent().parent();
                parentElement.find('.return_condition').prop('disabled', true);
                parentElement.find('.return_item_note').prop('disabled', true);
                parentElement.find('.return_date').val("");
                parentElement.find('.status').html("");
            }
        });

        $('.print-button').on('click', function (e) {
            toastr.success('Phiếu trả in thành công');
        });

        // Get information of item
        $('#barcode_stt_modal').keydown(function (e) {
            if (e.keyCode === 13) {
                $('#barcode_stt_modal').trigger('change');
                $('#barcode_stt_modal').focus();
            }
        });

        $('#barcode_stt_modal').bind('blur change', function () {
            let barcode_stt_val = $('#barcode_stt_modal').val();
            if (barcode_stt_val !== "") {
                check_item($(this), barcode_stt_val);
                $('#barcode_stt_modal').val("");
                $('#barcode_stt_modal').focus();
            }
        });

        function check_item(input_barcode_element, barcode_stt) {
            let help_element = input_barcode_element.parent().find('.help-block');
            help_element.html("");
            help_element.removeClass("badge badge-warning");
            let rented_date_val = $('#rented_date').val();
            if (barcode_stt != "") {
                $.ajax({
                    type: 'get',
                    url: '<?php echo e(route("return.check_item", $rental->id)); ?>',
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    data: {"barcode_stt": barcode_stt},
                    success: function (result) {
                        if (!$(`input[data-id="${result.data.id}"]`).is(':checked')) {
                            $(`input[data-id="${result.data.id}"]`).trigger('click');
                        }
                    },
                    error: function (request, status, error) {
                        let msg = 'Đã xảy ra lỗi, vui lòng thử lại hoặc liên hệ với quản trị viên của bạn.';
                        if (request.responseText != null) {
                            let responseData = JSON.parse(request.responseText);
                            console.log(responseData);
                            if ('errors' in responseData) {
                                console.log(responseData.errors);
                                $.each(responseData.errors, (value) => {
                                    msg = responseData.errors[value][0];
                                    return false;
                                });
                            } else {
                                msg = responseData.message;
                            }
                        }
                        help_element.html(msg);
                        help_element.addClass("badge badge-warning");
                        toastr.warning(msg);
                    },
                });
            }
        }
    </script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.master', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /home/u483135680/domains/cecics.com/public_html/cms/resources/views/return/add.blade.php ENDPATH**/ ?>