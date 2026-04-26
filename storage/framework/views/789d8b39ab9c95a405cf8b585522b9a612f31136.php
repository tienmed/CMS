<div class="row">
    <div class="col-md-12 rental-time">
        <legend>Thông tin thời gian</legend>
        <div class="row">
            <div class="col-sm-6 col-md-5 col-lg-4">
                <div class="form-group">
                    <label for="rented_date">Ngày mượn</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                                                    <span class="input-group-text">
                                                        <i class="far fa-calendar-alt"></i>
                                                    </span>
                        </div>
                        <input type="text" id="rented_date" name="rented_date"
                               class="form-control form-control-sm"
                               value="<?php echo e(date('d-m-Y', strtotime(old('rented_date', $rental->rented_date)))); ?>"
                               required>
                    </div>
                </div>
            </div>
            <div class="col-sm-6 col-md-5 col-lg-4">
                <div class="form-group">
                    <label for="rental_due_date">Hạn trả</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text">
                                <i class="far fa-calendar-alt"></i>
                            </span>
                        </div>
                        <input type="text" class="form-control form-control-sm"
                               id="rental_due_date"
                               name='due_date'
                               value="<?php echo e(date('d-m-Y', strtotime(old('due_date', $rental->due_date)))); ?>"
                               required>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-12 rental-user">
        <legend>Thông tin người mượn</legend>
        <div class="row">
            <div class="col-sm-6 col-md-6 col-lg-6 col-xl-4">
                <div class="form-group">
                    <label for="rented_full_name">Họ và tên</label>
                    <input type="text" required
                           class="form-control form-control-sm"
                           id="rented_full_name" name="rented_full_name"
                           value="<?php echo e(old('rented_full_name', $rental->rented_full_name)); ?>">
                    <div class="help-block"></div>
                </div>
            </div>
            <div class="col-sm-6 col-md-3 col-lg-3 col-xl-3">
                <div class="form-group">
                    <label for="rented_phone">Số điện thoại</label>
                    <input type="text"
                           class="form-control  form-control-sm"
                           id="rented_phone" name="rented_phone"
                           value="<?php echo e(old('rented_phone', $rental->rented_phone)); ?>">
                    <div class="help-block"></div>
                </div>
            </div>
            <div class="col-sm-6 col-md-3 col-lg-3 col-xl-3">
                <div class="form-group">
                    <label for="department">Bộ môn</label>
                    <select class="form-control custom-select custom-select-sm" required
                            id="department" name="department">
                        <option
                            <?php echo e(old('department', null) == null ? 'selected' : ''); ?> disabled>
                            Vui lòng chọn bộ môn
                        </option>
                        <?php $__currentLoopData = $departments; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $department): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <option value="<?php echo e($department->id); ?>"
                                <?php echo e(old('department', $rental->rented_by) == $department->id ? 'selected' : ''); ?>>
                                <?php echo e($department->name); ?>

                            </option>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </select>
                    <div class="help-block"></div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-12 rental-content">
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label for="note">Nội dung mượn</label>
                    <textarea id="note" name="note"
                              class="form-control form-control-sm"
                              rows="4"
                              placeholder="Ghi chú thông tin phiếu mượn..."
                    ><?php echo e(old('note',$rental->note)); ?></textarea>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-12 rental-item">
        <legend>Chi tiết phiếu mượn</legend>
        <div class="table-responsive" style="min-height: 310px">
            <table id="rental_table"
                   class="table table-sm table-striped table-bordered table-hover">
                <thead>
                <tr>
                    <th class="text-center" style="width: 15%">Barcode-stt</th>
                    <th class="text-center" style="width: 20%">Tên thiết bị</th>
                    <th class="text-center">Trạng thái</th>
                    <th class="text-center">Tình trạng</th>
                    <th class="text-center">Ngày phải trả</th>
                    <th class="text-center">Ghi chú</th>
                    <th></th>
                </tr>
                </thead>
                <tbody id="rental_body_table">
                <?php $__currentLoopData = old("items", $rental->uncompleted_items); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $index => $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <tr class="row-item" id="rental-row<?php echo e($index); ?>">
                        <td class="text-center">
                            <textarea name="items[<?php echo e($index); ?>][barcode_stt]"
                                      class="form-control form-control-sm barcode_stt"
                                      required readonly
                            ><?php echo e($item['barcode_stt'] ?? $item->item_info->barcode_stt); ?></textarea>
                            <div
                                class="help-block <?php echo e($errors->has('items.'.$index) ? 'badge badge-warning' : ''); ?>"
                            >
                                <?php echo e($errors->has('items.'.$index) ? $errors->first('items.'.$index) : ''); ?>

                            </div>
                        </td>
                        <td class="text-center">
                            <textarea name="items[<?php echo e($index); ?>][name]"
                                      class="form-control form-control-sm equipment_name"
                            ><?php echo e($item['name'] ?? $item->item_info->equipment->name); ?></textarea>
                            <div class="help-block"></div>
                        </td>
                        <td class="text-center">
                            <input type="text"
                                   name="items[<?php echo e($index); ?>][equipment_status]"
                                   value="<?php echo e($item['equipment_status'] ?? $item->item_info->equipment_status->name); ?>"
                                   class="form-control form-control-sm equipment_status"
                                   readonly="">
                            <div class="help-block"></div>
                        </td>
                        <td class="text-center">
                            <input type="text"
                                   name="items[<?php echo e($index); ?>][condition]"
                                   value="<?php echo e($item['condition'] ?? $item->rented_condition->name); ?>"
                                   class="form-control form-control-sm equipment_condition"
                                   readonly="">
                            <div class="help-block"></div>
                        </td>
                        <td class="text-left">
                            <div class="input-group">
                                <div class="input-group-prepend d-sm-none d-md-block">
                                    <span class="input-group-text">
                                            <i class="far fa-calendar-alt"></i>
                                    </span>
                                </div>
                                <input type="text"
                                       class="form-control form-control-sm float-right due_date"
                                       name="items[<?php echo e($index); ?>][due_date]"
                                       value="<?php echo e(date('d-m-Y', strtotime($item['due_date'] ?? $item->due_date))); ?>">
                            </div>
                            <div
                                class="help-block <?php echo e($errors->has("items.".$index.".due_date") ? 'badge badge-warning' : ''); ?>"
                            >
                                <?php echo e($errors->has("items.".$index.".due_date") ? $errors->first("items.".$index.".due_date") : ''); ?>

                            </div>
                        </td>
                        <td class="text-center">
                            <textarea name="items[<?php echo e($index); ?>][note]"
                                      class="form-control  form-control-sm note"
                            ><?php echo e($item['note']); ?></textarea>
                            <div class="help-block"></div>
                        </td>
                        <td class="text-left">
                            <button type="button" data-id="<?php echo e($index); ?>"
                                    data-toggle="tooltip" title="Remove"
                                    class="btn btn-sm btn-danger remove"><i
                                    class="fa fa-minus-circle"></i>
                            </button>
                        </td>
                    </tr>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                </tbody>
                <tfoot>
                <tr>
                    <td colspan="4">
                        <input type="text" id="barcode_stt_modal"
                               class="form-control form-control-sm">
                        <div class="help-block">Nhập barcode-stt để hiển thị thông tin</div>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                </tfoot>
            </table>
        </div>
    </div>
</div>

<?php $__env->startPush('stack-js'); ?>
    <script src="<?php echo e(asset('plugins/jquery.ns-autogrow-master/jquery.ns-autogrow.min.js')); ?>"></script>
    <script>
        $(document).ready(function () {
            $('#barcode_stt_modal').focus();
        });

        $('#rented_date').daterangepicker({
            timePicker: false,
            singleDatePicker: true,
            locale: {
                format: 'DD-MM-YYYY'
            }
        });

        $('#rental_due_date').daterangepicker({
            timePicker: false,
            singleDatePicker: true,
            locale: {
                format: 'DD-MM-YYYY'
            }
        });

        $('.equipment_name,.note').autogrow({vertical: true, horizontal: false});

        // Attribute for item-table
        $('.remove').click(function () {
            var data_id = $(this).attr('data-id');
            $('#rental-row' + data_id).remove();
        });
        $('.due_date').daterangepicker({
            timePicker: false,
            singleDatePicker: true,
            locale: {
                format: 'DD-MM-YYYY'
            }
        });

        let rental_row = $('tbody#rental_body_table tr').length;

        function is_duplicated_item(barcode_stt) {
            let list_added_barcodes = $('textarea.barcode_stt').map(function (i, el) {
                return $(el).val().trim();
            }).get();
            return list_added_barcodes.includes(barcode_stt);
        }

        function add_rental_detail(help_element, barcode_stt, equipment_name, equipment_status, equipment_condition) {
            if (is_duplicated_item(barcode_stt)) {
                help_element.html("Thiết bị đã có trong danh sách.");
                help_element.addClass("badge badge-warning");
                return false;
            } else {
                let html = '';
                html += '<tr class="row-item"  id="rental-row' + rental_row + '">';
                html += '<td class="text-center">\n' +
                    `        <textarea name="items[${rental_row}][barcode_stt]"` +
                    '                  class="form-control form-control-sm barcode_stt" required readonly' +
                    `        >${barcode_stt}</textarea>` +
                    '        <div class="help-block"></div>\n' +
                    '    </td>';
                html += '<td class="text-center">\n' +
                    `        <textarea name="items[${rental_row}][name]"` +
                    '                  class="form-control form-control-sm equipment_name"' +
                    `        >${equipment_name}</textarea>` +
                    '        <div class="help-block"></div>\n' +
                    '    </td>';
                html += ' <td class="text-center">\n' +
                    `          <input type="text" name="items[${rental_row}][condition]"\n` +
                    '                 value="' + equipment_status + '"\n' +
                    '                 class="form-control form-control-sm equipment_condition" readonly>\n' +
                    '          <div class="help-block"></div>\n' +
                    '     </td>';
                html += ' <td class="text-center">\n' +
                    `          <input type="text" name="items[${rental_row}][equipment_status]"\n` +
                    '                 value="' + equipment_condition + '"\n' +
                    '                 class="form-control form-control-sm equipment_status" readonly>\n' +
                    '          <div class="help-block"></div>\n' +
                    '     </td>';
                html += '<td class="text-left">\n' +
                    '        <div class="input-group">\n' +
                    '             <div class="input-group-prepend d-sm-none d-md-block">\n' +
                    '                  <span class="input-group-text">\n' +
                    '                        <i class="far fa-calendar-alt"></i>\n' +
                    '                  </span>\n' +
                    '             </div>\n' +
                    '             <input type="text" class="form-control form-control-sm float-right due_date"' +
                    `                    name="items[${rental_row}][due_date]"\n` +
                    '                    value="' + $('#rental_due_date').val() + '">\n' +
                    '         </div>' +
                    '        <div class="help-block"></div>\n' +
                    '</td>';
                html += '<td class="text-center">\n' +
                    `          <textarea name="items[${rental_row}][note]" \n` +
                    '                    class="form-control form-control-sm note"\n' +
                    '          ></textarea>\n' +
                    '          <div class="help-block"></div>\n' +
                    '    </td>';
                html += '<td class="text-left">\n' +
                    `        <button type="button" data-id="${rental_row}" data-toggle="tooltip"\n` +
                    '                title="Remove" class="btn btn-sm btn-danger remove"><i class="fa fa-minus-circle"></i></button>\n' +
                    '    </td>';
                html += '</tr>';

                $('#rental_body_table').append(html);
                $('.equipment_name,.note').autogrow({vertical: true, horizontal: false});

                // Attribute for item-table
                $('.remove').click(function () {
                    var data_id = $(this).attr('data-id');
                    $('#rental-row' + data_id).remove();
                });
                $('.due_date').daterangepicker({
                    timePicker: false,
                    singleDatePicker: true,
                    locale: {
                        format: 'DD-MM-YYYY'
                    }
                });
                rental_row++;
                return true;
            }
        }

        function get_item(this_element, barcode_stt) {
            let help_element = this_element.parent().find('.help-block');
            help_element.html("");
            help_element.removeClass("badge badge-warning");
            let rented_date_val = $('#rented_date').val();
            let rental_id_val = $('#rental_id').val();
            if (barcode_stt != "") {
                $.ajax({
                    type: 'get',
                    url: '<?php echo e(route("rental.get_item")); ?>',
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    data: {
                        "barcode_stt": barcode_stt,
                        "rented_date": rented_date_val,
                        "rental_id": rental_id_val,
                    },
                    success: function (result) {
                        let data = result.data;
                        if (add_rental_detail(help_element, data.barcode_stt, data.equipment.name, data.equipment_status.name, data.condition.name)) {
                            if (result.code === 202) {
                                toastr.info(result.message);
                            } else {
                                toastr.success(result.message);
                                help_element.html("Nhập barcode-stt để hiển thị thông tin");
                            }
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
                        help_element.html(msg);
                        help_element.addClass("badge badge-warning");
                        toastr.warning(msg);
                    },
                });
            }
        }

        // Get information of item
        $('#barcode_stt_modal').keydown(function (e) {
            if (e.keyCode === 13) {
                $('#barcode_stt_modal').trigger('change');
                $('#barcode_stt_modal').focus();
            }
        });

        $('#barcode_stt_modal').bind('blur change', function () {
            let barcode_stt_val = $('#barcode_stt_modal').val().trim();
            if (barcode_stt_val !== "") {
                get_item($(this), barcode_stt_val);
                $('#barcode_stt_modal').val("");
                $('#barcode_stt_modal').focus();
            }
        });
    </script>
<?php $__env->stopPush(); ?>
<?php /**PATH /home/u483135680/domains/cecics.com/public_html/cms/resources/views/rental/formPartial.blade.php ENDPATH**/ ?>