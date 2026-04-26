<?php $__env->startSection('page-header'); ?>
    <link href="<?php echo e(asset('plugins/dropzone-5.7.0/dropzone.min.css')); ?>"
          rel="stylesheet" type="text/css"/>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('breadcrumb'); ?>
    <ol class="breadcrumb float-sm-right">
        <li class="breadcrumb-item"><a href="/">Home</a></li>
        <li class="breadcrumb-item"><a href="/equipment">Dạnh sách Barcode</a></li>
        <li class="breadcrumb-item active">Thêm mới</li>
    </ol>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('content'); ?>
    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Thêm Barcode</h3>
                            <div class="card-tools">
                                <button type="submit" form="form-add-barcode"
                                        id="submit-form-add-barcode"
                                        class="btn btn-sm btn-outline-success">
                                    Lưu
                                </button>
                            </div>
                        </div>

                        <div class="card-body">
                            <div class="equipment-information">
                                <div class="row">
                                    <div class="col-md-12">
                                        <h5>Thông tin chung</h5>
                                    </div>

                                    <form id="form-add-barcode"
                                          action="<?php echo e(route('equipment.store')); ?>" method="POST"
                                          enctype="multipart/form-data">
                                        <?php echo csrf_field(); ?>
                                        <div class="row">
                                            <div class="col-sm-12 col-md-6">
                                                <div class="row">
                                                    <div class="col-sm-12 col-md-12 col-xl-6">
                                                        <div class="form-group">
                                                            <label for="barcode">Barcode mô hình - thiết bị</label>
                                                            <input type="text" required
                                                                   class="form-control form-control-sm"
                                                                   id="barcode" name="barcode"
                                                                   value="<?php echo e(old('barcode')); ?>"
                                                                   placeholder="Mã barcode của thiết bị...">
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-12 col-md-12 col-xl-6">
                                                        <div class="form-group">
                                                            <label for="equipment_name">Tên mô hình - thiết bị</label>
                                                            <input type="text" required
                                                                   class="form-control form-control-sm"
                                                                   id="equipment_name" name="equipment_name"
                                                                   value="<?php echo e(old('equipment_name')); ?>"
                                                                   placeholder="Tên thiết bị...">
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-6 col-md-6 col-xl-6">
                                                        <div class="form-group">
                                                            <label for="import_date">Năm nhập</label>
                                                            <div class="input-group input-group-sm">
                                                                <div class="input-group-prepend">
                                                            <span class="input-group-text">
                                                              <i class="far fa-calendar-alt"></i>
                                                            </span>
                                                                </div>
                                                                <input type="text" required
                                                                       class="form-control form-control-sm float-right"
                                                                       id="import_date"
                                                                       value="<?php echo e(old('import_date')); ?>"
                                                                       name='import_date'>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-6 col-md-6 col-xl-6">
                                                        <div class="form-group">
                                                            <label for="warranty_due_date">Hạn bảo hành</label>
                                                            <div class="input-group input-group-sm">
                                                                <div class="input-group-prepend">
                                                            <span class="input-group-text">
                                                                <i class="far fa-calendar-alt"></i>
                                                            </span>
                                                                </div>
                                                                <input type="text" required
                                                                       class="form-control form-control-sm float-right"
                                                                       id="warranty_due_date"
                                                                       value="<?php echo e(old('warranty_due_date')); ?>"
                                                                       name='warranty_due_date'>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-12 col-md-12 col-xl-6">
                                                        <div class="form-group">
                                                            <label for="type_id">Thuộc tính</label>
                                                            <select id="type_id" name="type_id" required
                                                                    class="form-control form-control-sm custom-select custom-select-sm">
                                                                <option value="" selected disabled>Select one</option>
                                                                <?php $__currentLoopData = $types; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $type): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                                                    <option
                                                                        value="<?php echo e($type->id); ?>"
                                                                        <?php echo e(old('type_id') == $type->id ? 'selected' : ''); ?>

                                                                    ><?php echo e($type->name); ?></option>
                                                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-12 col-md-12 col-xl-6">
                                                        <div class="form-group">
                                                            <label for="quantity">Số lượng</label>
                                                            <input type="number" required
                                                                   id="quantity" name="quantity"
                                                                   class="form-control form-control-sm"
                                                                   value="<?php echo e(old('quantity')); ?>"
                                                                   placeholder="Số lượng">
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-12 col-md-12 col-xl-12">
                                                        <div class="form-group">
                                                            <label for="inputStatus">Bộ môn</label>
                                                            <div class="form-check">
                                                                <div class='row col-md-12'>
                                                                    <?php $__currentLoopData = $departments; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $department): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                                                        <div class='col-md-3'>
                                                                            <input
                                                                                id="department-select-<?php echo e($department->id); ?>"
                                                                                name="departments[]"
                                                                                value="<?php echo e($department->id); ?>"
                                                                                <?php echo e((old('departments', null) != null && in_array($department->id, old('departments'))) ? 'checked' : ''); ?>

                                                                                class="form-check-input"
                                                                                type="checkbox">
                                                                            <label class="form-check-label"
                                                                                   for="department-select-<?php echo e($department->id); ?>">
                                                                                <?php echo e($department->name); ?>

                                                                            </label>
                                                                        </div>
                                                                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-12 col-md-12 col-xl-12">
                                                        <div class="form-group">
                                                            <label for="url">Đường dẫn google drive</label>
                                                            <input type="text"
                                                                   class="form-control form-control-sm"
                                                                   id="url" name="url"
                                                                   value="<?php echo e(old('url')); ?>"
                                                                   placeholder="Đường dẫn folder">
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-12 col-md-12 col-xl-12">
                                                        <div class="form-group">
                                                            <label for="note">Ghi Chú</label>
                                                            <textarea class="form-control form-control-sm"
                                                                      id="note" name="note" rows="4"
                                                                      placeholder="Ghi chú thông tin thiết bị..."
                                                            ><?php echo e(old('note')); ?></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-sm-12 col-md-6">
                                                <div class="row">
                                                    <div class="col-md-12">
                                                        <div id="upload-image-dropzone"
                                                             class="m-2">
                                                            <label for="file">Hình ảnh</label>
                                                            <input hidden id="file"
                                                                   name="file" multiple/>
                                                            <div class="dropzone dropzone-custom dropzone-previews"
                                                                 id="my-dropzone">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <div class="modal fade" id="modal-upload-slideshow">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-loading overlay d-flex justify-content-center align-items-center">
                    <i class="fas fa-2x fa-sync fa-spin"></i>
                </div>
                <div class="modal-body">
                    <div id="uploaded-image-slider" class="carousel slide"
                         data-ride="carousel">
                        <div class="carousel-inner">
                        </div>
                        <a class="carousel-control-prev"
                           href="#uploaded-image-slider" role="button"
                           data-slide="prev">
                            <span class="carousel-control-custom-icon"
                                  aria-hidden="true">
                              <i class="fas fa-chevron-left"></i>
                            </span>
                            <span class="sr-only">Previous</span>
                        </a>
                        <a class="carousel-control-next"
                           href="#uploaded-image-slider" role="button"
                           data-slide="next">
                            <span class="carousel-control-custom-icon"
                                  aria-hidden="true">
                              <i class="fas fa-chevron-right"></i>
                            </span>
                            <span class="sr-only">Next</span>
                        </a>
                    </div>
                </div>
            </div>
            <!-- /.modal-content -->
        </div>
        <ol class="carousel-indicators">
        </ol>
        <!-- /.modal-dialog -->
    </div>
    <!-- /.modal -->
<?php $__env->stopSection(); ?>

<?php $__env->startSection('js'); ?>
    <script src="<?php echo e(asset('plugins/dropzone-5.7.0/dropzone.min.js')); ?>"></script>
    <script>
        $(document).ready(function () {
            $('#barcode').focus();
        });

        $('#warranty_due_date').daterangepicker({
            timePicker: false,
            singleDatePicker: true,
            locale: {
                format: 'DD-MM-YYYY'
            }
        });
        $('#import_date').daterangepicker({
            timePicker: false,
            singleDatePicker: true,
            locale: {
                format: 'DD-MM-YYYY'
            }
        });
        Dropzone.options.myDropzone = { // The camelized version of the ID of the form element
            // The configuration we've talked about above
            url: '#',
            addRemoveLinks: true,
            autoProcessQueue: false,
            // autoQueue: false,
            uploadMultiple: true,
            maxFiles: 5,
            maxFilesize: 10,
            clickable: true,
            previewsContainer: ".dropzone-previews",
            acceptedFiles: 'image/*',
            dictDefaultMessage: '<i class="fas fa-images"></i>&nbsp;Click hoặc kéo thả hình vào đây để upload',
            dictInvalidFileType: "Bạn chỉ có thể upload file hình ảnh.",
            dictMaxFilesExceeded: "Bạn chỉ có thể upload tối đa 5 hình.",
            previewTemplate: "<div class=\"dz-preview dz-file-preview\">\n" +
                "  <div class=\"dz-image\"><img data-dz-thumbnail /></div>\n" +
                "  <div class=\"dz-details\">\n" +
                "    <div class=\"dz-size\"><span data-dz-size></span></div>\n" +
                "    <div class=\"dz-filename\"><span data-dz-name></span></div>\n" +
                "  </div>\n" +
                "  <div class=\"dz-progress\"><span class=\"dz-upload\" data-dz-uploadprogress></span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n  <div class=\"dz-success-mark\">\n" +
                "    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n" +
                "      <title>Check</title>\n" +
                "      <g stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n" +
                "        <path d=\"M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" stroke-opacity=\"0.198794158\" stroke=\"#747474\" fill-opacity=\"0.816519475\" fill=\"#FFFFFF\"></path>\n" +
                "      </g>\n" +
                "    </svg>\n" +
                "  </div>\n" +
                "  <div class=\"dz-error-mark\">\n" +
                "    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n" +
                "      <title>Error</title>\n" +
                "      <g stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n" +
                "        <g stroke=\"#747474\" stroke-opacity=\"0.198794158\" fill=\"#FFFFFF\" fill-opacity=\"0.816519475\">\n" +
                "          <path d=\"M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\"></path>\n" +
                "        </g>\n" +
                "      </g>\n" +
                "    </svg>\n" +
                "  </div>" +
                "  <a class=\"dz-slideshow\"\n" +
                "     href=\"javascript:undefined;\"\n" +
                "     data-toggle=\"modal\" data-target=\"#modal-upload-slideshow\"\n" +
                "  >Preview</a>" +
                "</div>",
            // The setting up of the dropzone
            init: function () {
                this.on("addedfile", function (file, response) {
                    if (this.files.length) {
                        var _i, _len;
                        for (_i = 0, _len = this.files.length; _i < _len - 1; _i++) // -1 to exclude current file
                        {
                            if (this.files[_i].name === file.name
                                && this.files[_i].size === file.size
                                && this.files[_i].lastModified === file.lastModified) {
                                toastr.warning('Bạn đã chọn tấm hình này, vui lòng chọn tấm khác');
                                this.removeFile(file);
                                return false;
                            }
                        }
                    }
                });
                this.on("error", function (file, message) {
                    if (!file.accepted) {
                        toastr.warning(message);
                        this.removeFile(file);
                    }
                });
            },
        }

        // Handle click Slideshow
        $("#upload-image-dropzone").on("click", ".dz-slideshow", function () {
            $(".carousel-indicators").empty();
            $(".carousel-inner").empty();
            let $modal_element = $('#modal-upload-slideshow');
            let modal_width = $modal_element.find('.modal-body').outerWidth(false);
            let slider_image_width = modal_width * 90 / 100;
            let image_name = $(this).parent().find('.dz-image img').attr("alt");
            add_image_list_to_slider($('.dropzone')[0].dropzone.files,
                slider_image_width, image_name);
            let $modal_loading = $modal_element.find('.modal-loading');
            setTimeout(function () {
                $modal_loading.addClass('d-none');
                $modal_element.modal('show');
            }, 100);
        });

        // Handle click indicators outside div carousel
        $(".carousel").on("slid.bs.carousel", function () {
            let to_slide = $(".carousel-item.active").attr("data-slide-no");
            $(".myCarousel-target.active").removeClass("active");
            $(`.carousel-indicators .myCarousel-target[data-slide-to=${to_slide}]`).addClass("active");
        });

        $('#modal-upload-slideshow').on('hide.bs.modal', function () {
            $(this).find('.modal-loading').removeClass('d-none');
        });

        $('#form-add-barcode').submit(function (event) {
            event.preventDefault();
            console.log('Running');
            let uploadImage = [];
            $('.dropzone')[0].dropzone.getQueuedFiles().forEach(function (file) {
                uploadImage.push({
                    'name': file.name,
                    'width': file.width,
                    'height': file.height,
                    'size': file.size,
                    'dataURL': file.dataURL,
                })
            });
            $('#file').val(JSON.stringify(uploadImage));
            this.submit();
        });
    </script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.master', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /home/u483135680/domains/cecics.com/public_html/cms/resources/views/equipment/add.blade.php ENDPATH**/ ?>