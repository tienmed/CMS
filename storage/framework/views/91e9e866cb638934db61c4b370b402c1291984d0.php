<div class="col-md-12 row">
    <div class="col-sm-12 col-md-4 col-xl-4">
        <div class="form-group">
            <label for="username">Tên tài khoản</label>
            <input type="text"
                   class="form-control form-control-sm"
                   name="username" id="username"
                   value="<?php echo e(old('username',$user->username)); ?>"
                   placeholder="Tên tài khoản">
        </div>
    </div>
    <div class="col-sm-12 col-md-4 col-xl-4">
        <div class="form-group">
            <label for="password">Mật khẩu</label>
            <input type="password"
                   class="form-control form-control-sm"
                   name="password" id="password"
                   placeholder="Mật khẩu">
        </div>
    </div>
    <div class="col-sm-12 col-md-4 col-xl-4">
        <div class="form-group">
            <label for="password_confirmation">Nhập lại mật khẩu</label>
            <input type="password"
                   class="form-control form-control-sm"
                   name="password_confirmation" id="password_confirmation"
                   placeholder="Nhập lại mật khẩu">
        </div>
    </div>
</div>
<div class="col-md-12 row">
    <div class="col-sm-12 col-md-4 col-xl-4">
        <div class="form-group form-group-sm">
            <label for="name">Họ và tên</label>
            <input type="text" class="form-control form-control-sm"
                   name="name" id="name"
                   value="<?php echo e(old('name',$user->name)); ?>"
                   placeholder="Nguyễn Thị A">
        </div>
    </div>
    <div class="col-sm-12 col-md-4 col-xl-4">
        <div class="form-group">
            <label for="department">Bộ môn</label>
            <select class="form-control custom-select custom-select-sm"
                    name="department" id="department">
                <option selected disabled>Vui lòng chọn bộ môn</option>
                <?php $__currentLoopData = $departments; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $department): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <option value="<?php echo e($department->id); ?>"
                        <?php echo e(old('department',$user->department_id) == $department->id ? 'selected' : ''); ?>

                    >
                        <?php echo e($department->name); ?>

                    </option>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </select>
        </div>
    </div>
    <div class="col-sm-12 col-md-4 col-xl-4">
        <div class="form-group">
            <label for="user_role">Phân quyền</label>
            <select class="form-control custom-select custom-select-sm"
                    name="role" id="role">
                <option selected disabled>Vui lòng chọn phân quyền</option>
                <?php $__currentLoopData = $roles; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $role): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <option value="<?php echo e($role->id); ?>"
                        <?php echo e($user->roles->contains($role->id) ? 'selected' : ''); ?>

                    >
                        <?php echo e($role->name); ?>

                    </option>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </select>
        </div>
    </div>
</div>
<?php /**PATH /home/u483135680/domains/cecics.com/public_html/cms/resources/views/users/formPartial.blade.php ENDPATH**/ ?>