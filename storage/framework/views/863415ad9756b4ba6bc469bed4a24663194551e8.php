<?php $__env->startSection('breadcrumb'); ?>
    <ol class="breadcrumb float-sm-right">
        <li class="breadcrumb-item"><a href="/">Home</a></li>
        <li class="breadcrumb-item"><a href="<?php echo e(route('rental.index')); ?>">Danh sách phiếu mượn</a></li>
        <li class="breadcrumb-item active">Chi tiết phiếu mượn #<?php echo e($rental->ticket_no); ?></li>
    </ol>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('content'); ?>
    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-sm-12">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Chi tiết phiếu mượn #<?php echo e($rental->ticket_no); ?></h3>
                            <div class="card-tools">
                                <a class="btn btn-sm btn-info print-button"
                                   href="<?php echo e(route('rental.print_preview', $rental->id)); ?>"
                                ><i class="fas fa-print"></i>&nbsp;In
                                </a>
                                
                            </div>
                        </div>
                        <form id="form-product"
                              action="/rental" method="post"
                              enctype="multipart/form-data">
                            <div class="card-body">
                                <div class="col-md-12">
                                    <div class="row">
                                        
                                        <div class="rental-detail-info col-md-12">
                                            <div class="row">
                                                <div class="col-sm-12 col-md-12 col-xl-12 row">
                                                    <div class="col-sm-12 col-md-3 col-xl-2">
                                                        <div class="form-group">
                                                            <label for="approved_user">Người cho mượn</label>
                                                            <input type="text"
                                                                   class="form-control form-control-sm"
                                                                   id="approved_user" name="approved_user"
                                                                   value="<?php echo e($rental->approved_full_name); ?>"
                                                                   readonly>
                                                            <div class="help-block"></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="col-sm-12 col-md-12 col-xl-12 row">
                                                    <div class="col-sm-12 col-md-6 col-xl-2">
                                                        <div class="form-group">
                                                            <label for="rented_date">Ngày mượn</label>
                                                            <input type="text"
                                                                   class="form-control form-control-sm"
                                                                   id="rented_date" name="rented_date"
                                                                   value="<?php echo e(date('d-m-Y', strtotime($rental->rented_date))); ?>"
                                                                   readonly>
                                                            <div class="help-block"></div>
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-12 col-md-6 col-xl-2">
                                                        <div class="form-group">
                                                            <label for="due_date">Hạn trả chung</label>
                                                            <input type="text"
                                                                   class="form-control form-control-sm"
                                                                   id="due_date" name="due_date"
                                                                   value="<?php echo e(date('d-m-Y', strtotime($rental->due_date))); ?>"
                                                                   readonly>
                                                            <div class="help-block"></div>
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-12 col-md-6 col-xl-4">
                                                        <div class="form-group">
                                                            <label for="rented_full_name">Người Mượn</label>
                                                            <input type="text"
                                                                   class="form-control form-control-sm"
                                                                   id="rented_full_name" name="rented_full_name"
                                                                   value="<?php echo e($rental->rented_full_name); ?>" readonly>
                                                            <div class="help-block"></div>
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-12 col-md-3 col-xl-2">
                                                        <div class="form-group">
                                                            <label for="rented_phone">Số điện thoại</label>
                                                            <input type="text"
                                                                   class="form-control form-control-sm"
                                                                   id="rented_phone" name="rented_phone"
                                                                   value="<?php echo e($rental->rented_phone); ?>"
                                                                   readonly>
                                                            <div class="help-block"></div>
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-12 col-md-3 col-xl-2">
                                                        <div class="form-group">
                                                            <label for="department">Bộ môn</label>
                                                            <input type="text"
                                                                   class="form-control form-control-sm"
                                                                   id="department" name="department"
                                                                   value="<?php echo e($rental->rented_department->name); ?>"
                                                                   readonly>
                                                            <div class="help-block"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-sm-12 col-md-12 col-xl-12 row">
                                                    <div class="col-sm-12 col-md-6">
                                                        <div class="form-group">
                                                            <label for="note">Nội dung mượn</label>
                                                            <textarea class="form-control form-control-sm"
                                                                      id="note" name="note"
                                                                      rows="4" readonly
                                                            ><?php echo e($rental->note); ?></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <?php if(empty($rental->completed_date)): ?>
                                            
                                            <div class="col-md-12 rental-list m-2">
                                                <div class="row">
                                                    <div class="col-md-12">
                                                        <div class="row">
                                                            <h4 class="col-md-6">Danh sách thiết bị mượn</h4>
                                                            <div class="col-md-6 text-right">
                                                                <a class="btn btn-sm btn-outline-primary"
                                                                   style="min-width: 80px"
                                                                   href="<?php echo e(route('return.add', $rental->id)); ?>">Trả</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="table-responsive">
                                                        <table id="rental_table"
                                                               class="table table-sm table-striped table-bordered table-hover">
                                                            <thead>
                                                            <tr>
                                                                <th class="text-center">Barcode-stt</th>
                                                                <th class="text-center">Tên thiết bị</th>
                                                                <th class="text-center">Tình trạng lúc mượn</th>
                                                                <th class="text-center">Hạn trả</th>
                                                                <th class="text-center">Ghi chú</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            <?php $__currentLoopData = $rental->uncompleted_items; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $idx => $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                                                <tr class="row-item" id="rental-row<?php echo e($idx); ?>"
                                                                    data-id="<?php echo e($idx); ?>">
                                                                    <td class="text-center">
                                                                        <?php echo e($item->item_info->barcode_stt); ?>

                                                                    </td>
                                                                    <td class="text-center">
                                                                        <?php echo e($item->item_info->equipment->name); ?>

                                                                    </td>
                                                                    <td class="text-center">
                                                                        <?php echo e($item->rented_condition->name); ?>

                                                                    </td>
                                                                    <td class="text-left">
                                                                        <?php echo e(date('d-m-Y', strtotime($item->due_date))); ?>

                                                                    </td>
                                                                    <td class="text-center">
                                                                        <?php echo e($item->note); ?>

                                                                    </td>
                                                                </tr>
                                                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        <?php endif; ?>
                                        <?php if($rental->returned_tickets->count() > 0): ?>
                                            
                                            <div class="col-md-12 returned-list mb-3">
                                                <div class="row">
                                                    <div class="col-md-12">
                                                        <div class="row">
                                                            <h4 class="col-md-6">Mô hình / thiết bị đã trả</h4>
                                                        </div>
                                                    </div>
                                                    <?php $__currentLoopData = $rental->returned_tickets; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $returned_ticket): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                                        <div class="col-md-12">
                                                            <h4>
                                                                <a href="<?php echo e(route('return.detail', $returned_ticket->id)); ?>">#<?php echo e($returned_ticket->ticket_no); ?></a>
                                                            </h4>
                                                            <div class="col-md-12">
                                                                <p><b>Người nhận:</b>
                                                                    <span
                                                                        class="text-uppercase"><?php echo e($returned_ticket->approved_full_name); ?></span>
                                                                </p>
                                                            </div>
                                                            <div class="table-responsive">
                                                                <table id="returned_table"
                                                                       class="table table-sm table-striped table-bordered table-hover">
                                                                    <thead>
                                                                    <tr>
                                                                        <th class="text-center">Barcode-stt</th>
                                                                        <th class="text-center">Tên thiết bị</th>
                                                                        <th class="text-center">Ngày mượn</th>
                                                                        <th class="text-center">Tình trạng lúc mượn</th>
                                                                        <th class="text-center">Trạng thái</th>
                                                                        <th class="text-center">Ghi chú mượn</th>
                                                                        <th class="text-center" style="width: 10%">
                                                                            Ngày trả
                                                                        </th>
                                                                        <th class="text-center" style="width: 10%">
                                                                            Tình trạng lúc trả
                                                                        </th>
                                                                        <th class="text-center">Ghi chú trả</th>
                                                                    </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                    <?php $__currentLoopData = $returned_ticket->returned_items; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                                                        <tr data-id="4">
                                                                            <td><?php echo e($item->rented_detail->item_info->barcode_stt); ?></td>
                                                                            <td class="text-center"><?php echo e($item->rented_detail->item_info->equipment->name); ?></td>
                                                                            <td class="text-center"><?php echo e(date('d-m-Y', strtotime($rental->rented_date))); ?></td>
                                                                            <td class="text-center"><?php echo e($item->rented_detail->rented_condition->name); ?></td>
                                                                            <td class="text-center returned-status">
                                                                                <?php echo e($item->rented_detail->item_info->equipment_status->name); ?>

                                                                            </td>
                                                                            <td class="text-center"><?php echo e($item->rented_detail->note); ?></td>
                                                                            <td>
                                                                                <?php echo e(date('d-m-Y', strtotime($item->return_date))); ?>

                                                                            </td>
                                                                            <td class="text-center">
                                                                                <?php echo e($item->returned_condition->name); ?>

                                                                            </td>
                                                                            <td class="text-center"><?php echo e($item->note); ?></td>
                                                                        </tr>
                                                                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                                </div>
                                            </div>
                                        <?php endif; ?>

                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('js'); ?>
    <script>
        // Initialize DatatTable Elements
        $('#rental_table,#returned_table').DataTable({
            "paging": false,
            "lengthChange": false,
            "searching": false,
            "ordering": false,
            "info": false,
            "autoWidth": false,
            "responsive": true,
        });
    </script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.master', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /home/u483135680/domains/cecics.com/public_html/cms/resources/views/rental/detail.blade.php ENDPATH**/ ?>