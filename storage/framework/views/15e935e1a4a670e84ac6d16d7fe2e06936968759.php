<div class="row">
    
    <div class="col-md-12 mb-3">
        <div class="row">
            <div class="col-md-12 row">
                <div class="col-sm-12 col-md-3 col-xl-3">
                    <div class="form-group">
                        <label for="rental_ticket">Phiếu mượn</label>
                        <input type="text"
                               class="form-control form-control-sm rental_ticket"
                               name="rental_ticket" id="rental_ticket"
                               value="<?php echo e($rental->ticket_no); ?>" readonly>
                        <div class="help-block"></div>
                    </div>
                </div>
                <div class="col-sm-12 col-md-3 col-xl-3">
                    <div class="form-group">
                        <label for="department">Bộ môn</label>
                        <input type="text" class="form-control form-control-sm"
                               name="department" id="department"
                               value="<?php echo e($rental->rented_department->name); ?>" readonly>
                        <div class="help-block"></div>
                    </div>
                </div>
                <div class="col-sm-12 col-md-3 col-xl-3">
                    <div class="form-group">
                        <label for="rented_date">Ngày mượn</label>
                        <input type="text" class="form-control form-control-sm"
                               name="rented_date" id="rented_date"
                               value="<?php echo e(date('d-m-Y', strtotime($rental->rented_date))); ?>"
                               readonly>
                    </div>
                </div>
                <div class="col-sm-12 col-md-3 col-xl-3">
                    <div class="form-group">
                        <label for="due_date">Hạn trả</label>
                        <input type="text" class="form-control form-control-sm"
                               name="due_date" id="due_date"
                               value="<?php echo e(date('d-m-Y', strtotime($rental->due_date))); ?>"
                               readonly>
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
                               value="<?php echo e(old('return_full_name', $return->return_full_name)); ?>">
                        <div class="help-block"></div>
                    </div>
                </div>
                <div class="col-sm-12 col-md-3 col-xl-3">
                    <div class="form-group">
                        <label for="return_phone">Số điện thoại</label>
                        <input type="text" class="form-control form-control-sm return_phone"
                               name="return_phone" id="return_phone"
                               value="<?php echo e(old('return_phone', $return->return_phone)); ?>">
                        <div class="help-block"></div>
                    </div>
                </div>
                <div class="col-sm-12 col-md-3 col-xl-3">
                    <div class="form-group">
                        <label for="rented_date">Ngày trả</label>
                        <div class="input-group">
                            <div class="input-group-prepend">
                        <span class="input-group-text">
                            <i class="far fa-calendar-alt"></i>
                        </span>
                            </div>
                            <input type="text" id="returned_date" name="returned_date"
                                   class="form-control form-control-sm"
                                   value="<?php echo e(date('d-m-Y', strtotime(old('returned_date') ?? now()))); ?>"
                                   required>
                        </div>
                    </div>
                </div>
                <div class="col-sm-12 col-md-3 col-xl-3">
                    <label for="note">Ghi Chú</label>
                    <textarea class="form-control form-control-sm note"
                              name="note" id="note"
                              placeholder="Ghi chú nội dung phiếu trả"
                    ><?php echo e(old('note', $return->note)); ?></textarea>
                </div>
            </div>
        </div>
    </div>
    
    <div class="col-md-12 return-list mb-3">
        <div class="row">
            <div class="col-md-12">
                <h4>Danh sách mô hình / thiết bị mượn</h4>
            </div>
            <div class="col-md-12">
                <div class="table-responsive">
                    <table id="return_table"
                           class="table table-sm table-striped table-bordered table-hover">
                        <thead>
                        <tr>
                            <th class="text-center">Trả</th>
                            <th class="text-center">Barcode-stt</th>
                            <th class="text-center" style="width: 15%">
                                Tên thiết bị
                            </th>
                            <th class="text-center">Ngày mượn</th>
                            <th class="text-center">Tình trạng lúc mượn</th>
                            <th class="text-center">Trạng thái</th>
                            <th class="text-center" style="width: 15%">
                                Ghi chú phiếu mượn
                            </th>
                            <th class="text-center">Ngày trả</th>
                            <th class="text-center" style="max-width: 15%">Ghi chú</th>
                            <th class="text-center">Tình trạng lúc trả</th>
                        </tr>
                        </thead>
                        <tbody id="rental_body_table">
                        <?php if(!empty($return)): ?>
                            <?php $__currentLoopData = $return->returned_items; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $idx => $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                <tr data-id="<?php echo e($idx); ?>">
                                    <td class="dt-body-center text-center">
                                        <input type="checkbox"
                                               class="return_checkbox"
                                               name="return_items[<?php echo e($item->rented_detail->id); ?>][is_checked]"
                                               data-id="<?php echo e($item->equipment_item_id); ?>"
                                               value="1" checked>
                                    </td>
                                    <td><?php echo e($item->rented_detail->item_info->barcode_stt); ?></td>
                                    <td class="text-center"><?php echo e($item->rented_detail->item_info->equipment->name); ?></td>
                                    <td class="text-center"><?php echo e(date("d-m-Y", strtotime($item->rented_detail->rental_ticket->rented_date))); ?></td>
                                    <td class="text-center"><?php echo e($item->rented_detail->rented_condition->name); ?></td>
                                    <td class="text-center status"></td>
                                    <td class="text-center"><?php echo e($item->rented_detail->note); ?></td>
                                    <td style="width: 10%">
                                        <div class="input-group input-group-sm">
                                            <div class="input-group-prepend">
                                    <span class="input-group-text">
                                        <i class="far fa-calendar-alt"></i>
                                    </span>
                                            </div>
                                            <input type="text"
                                                   class="form-control form-control-sm float-right return_date"
                                                   id="return_date" name="return_date" disabled>
                                        </div>
                                    </td>
                                    <td class="text-center" style="width: 10%">
                                    <textarea id="return_item_note"
                                              name="return_items[<?php echo e($item->rented_detail->id); ?>][note]"
                                              class="form-control  form-control-sm return_item_note old"
                                    ><?php echo e($item->note); ?></textarea>
                                    </td>
                                    <td class="text-center" style="width: 10%">
                                        <select id="return_condition"
                                                name="return_items[<?php echo e($item->rented_detail->id); ?>][return_condition]"
                                                class="form-control custom-select custom-select-sm return_condition old"
                                        >
                                            <option selected disabled>Select one</option>
                                            <?php $__currentLoopData = $conditions; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $condition): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                                <option
                                                    value="<?php echo e($condition->id); ?>" <?php echo e($condition->id == $item->condition_id ? 'selected' : ''); ?>>
                                                    <?php echo e($condition->name); ?>

                                                </option>
                                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                        </select>
                                    </td>
                                </tr>
                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                        <?php endif; ?>
                        <?php $__currentLoopData = $rental->uncompleted_items; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $idx => $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <?php
                                $idx = $idx + count($return->returned_items)
                            ?>
                            <tr data-id="<?php echo e($idx); ?>">
                                <td class="dt-body-center text-center">
                                    <input type="checkbox"
                                           class="return_checkbox"
                                           name="return_items[<?php echo e($item->id); ?>][is_checked]"
                                           data-id="<?php echo e($item->equipment_item_id); ?>"
                                           value="1" disabled>
                                </td>
                                <td><?php echo e($item->item_info->barcode_stt); ?></td>
                                <td class="text-center"><?php echo e($item->item_info->equipment->name); ?></td>
                                <td class="text-center"><?php echo e(date("d-m-Y", strtotime($item->rental_ticket->rented_date))); ?></td>
                                <td class="text-center"><?php echo e($item->rented_condition->name); ?></td>
                                <td class="text-center status"></td>
                                <td class="text-center"><?php echo e($item->note); ?></td>
                                <td style="width: 10%">
                                    <div class="input-group input-group-sm">
                                        <div class="input-group-prepend">
                                <span class="input-group-text">
                                    <i class="far fa-calendar-alt"></i>
                                </span>
                                        </div>
                                        <input type="text"
                                               class="form-control form-control-sm float-right return_date"
                                               id="return_date" name="return_date" disabled>
                                    </div>
                                </td>
                                <td class="text-center" style="width: 10%">
                                <textarea id="return_item_note"
                                          name="return_items[<?php echo e($item->id); ?>][note]"
                                          class="form-control  form-control-sm return_item_note"
                                          disabled></textarea>
                                </td>
                                <td class="text-center" style="width: 10%">
                                    <select id="return_condition"
                                            name="return_items[<?php echo e($item->id); ?>][return_condition]"
                                            class="form-control custom-select custom-select-sm return_condition"
                                            disabled>
                                        <option selected disabled>Select one</option>
                                        <?php $__currentLoopData = $conditions; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $condition): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                            <option value="<?php echo e($condition->id); ?>">
                                                <?php echo e($condition->name); ?>

                                            </option>
                                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                    </select>
                                </td>
                            </tr>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colspan='3'>
                                <input type="text" id="barcode_stt_modal"
                                       class="form-control  form-control-sm barcode_stt_modal"
                                       disabled>
                                <div class="help-block">Nhập barcode-stt cần trả</div>
                                <input type="hidden" id="equipment_name_modal"
                                       class="form-control  form-control-sm">
                                <input type="hidden" id="equipment_status_modal"
                                       class="form-control form-control-sm">
                            </td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<?php $__env->startPush('stack-js'); ?>
<?php $__env->stopPush(); ?>
<?php /**PATH /home/u483135680/domains/cecics.com/public_html/cms/resources/views/return/formPartial.blade.php ENDPATH**/ ?>