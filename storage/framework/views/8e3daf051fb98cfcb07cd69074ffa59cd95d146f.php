<aside class="main-sidebar elevation-4 sidebar-light-lightblue">
    <!-- Brand Logo -->
    <a href="/" class="brand-link">
        <img src="<?php echo e(asset('asset/img/AdminLTELogo.png')); ?>"
             alt="CECICS Logo"
             class="brand-image img-circle elevation-3"
             style="opacity: .8">
        <span class="brand-text font-weight-light">CECICS</span>
    </a>

    <!-- Sidebar -->
    <div class="sidebar">
        <!-- Sidebar user panel (optional) -->
        <div class="user-panel mt-3 pb-3 mb-3 d-flex">
            <div class="image">
                <img src="<?php echo e(asset('asset/img/user2-160x160.jpg')); ?>" class="img-circle elevation-2" alt="User Image">
            </div>
            <div class="info">
                <a href="#" class="d-block"><?php echo e(\Illuminate\Support\Facades\Auth::user()->username); ?></a>
            </div>
        </div>

        <!-- Sidebar Menu -->
        <nav class="mt-2">
            <ul class="nav nav-pills nav-sidebar flex-column nav-flat nav-child-indent"
                data-widget="treeview" role="menu" data-accordion="false">
                <!-- Add icons to the links using the .nav-icon class
                     with font-awesome or any other icon font library -->

                <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->any(["Xem danh sách phiếu mượn","Tạo phiếu mượn"])): ?>
                    <li class="nav-header">Quản lí phiếu mượn/trả</li>
                    <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check("Xem danh sách phiếu mượn")): ?>
                        <li class="nav-item has-treeview">
                            <a href="/rental" class="nav-link">
                                <i class="nav-icon fas fa-file"></i>
                                <p>Phiếu mượn</p>
                            </a>
                        </li>
                    <?php endif; ?>
                    <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check("Tạo phiếu mượn")): ?>
                        <li class="nav-item has-treeview">
                            <a href="/rental/add" class="nav-link">
                                <i class="nav-icon fas fa-plus"></i>
                                <p>Tạo phiếu mượn</p>
                            </a>
                        </li>
                    <?php endif; ?>
                    <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check("Xem danh sách phiếu trả")): ?>
                        <li class="nav-item has-treeview">
                            <a href="/return" class="nav-link">
                                <i class="nav-icon fas fa-file"></i>
                                <p>Phiếu trả</p>
                            </a>
                        </li>
                    <?php endif; ?>
                    <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check("Xem lịch sử mượn thiết bị")): ?>
                        <li class="nav-item has-treeview">
                            <a href="<?php echo e(route('rental.rental_history')); ?>" class="nav-link">
                                <i class="nav-icon fa fa-history"></i>
                                <p>Lịch sử mượn thiết bị</p>
                            </a>
                        </li>
                    <?php endif; ?>
                <?php endif; ?>

                <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->any(["Xem danh sách barcode","Xem danh sách barcode-stt",
                            "Tạo barcode"])): ?>
                    <li class="nav-header">Quản lí Barcode</li>
                    <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check("Xem danh sách barcode")): ?>
                        <li class="nav-item has-treeview">
                            <a href="/equipment" class="nav-link">
                                <i class="nav-icon fas fa-file"></i>
                                <p>Barcode</p>
                            </a>
                        </li>
                    <?php endif; ?>
                    <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check("Tạo barcode")): ?>
                        <li class="nav-item has-treeview">
                            <a href="/equipment/add" class="nav-link">
                                <i class="nav-icon fas fa-plus"></i>
                                <p>Nhập Barcode</p>
                            </a>
                        </li>
                    <?php endif; ?>
                    <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check("Xem danh sách barcode-stt")): ?>
                        <li class="nav-item has-treeview">
                            <a href="<?php echo e(route('equipment_item.index')); ?>" class="nav-link">
                                <i class="nav-icon fas fa-file"></i>
                                <p>Barcode-stt</p>
                            </a>
                        </li>
                    <?php endif; ?>
                <?php endif; ?>

                
                <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->any(["Xem danh sách tình trạng","Xem danh sách trạng thái","Xem danh sách bộ môn","Xem danh sách thuộc tính"])): ?>
                    <li class="nav-header">Quản lí hệ thống</li>
                    <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check("Xem danh sách tình trạng")): ?>
                        <li class="nav-item has-treeview">
                            <a href="/condition" class="nav-link">
                                <i class="nav-icon fas fa-file"></i>
                                <p>Tình Trạng</p>
                            </a>
                        </li>
                    <?php endif; ?>
                    <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check("Xem danh sách trạng thái")): ?>
                        <li class="nav-item has-treeview">
                            <a href="/status" class="nav-link">
                                <i class="nav-icon fas fa-file"></i>
                                <p>Trạng thái</p>
                            </a>
                        </li>
                    <?php endif; ?>
                    <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check("Xem danh sách bộ môn")): ?>
                        <li class="nav-item has-treeview">
                            <a href="/department" class="nav-link">
                                <i class="nav-icon fas fa-file"></i>
                                <p>Bộ môn</p>
                            </a>
                        </li>
                    <?php endif; ?>
                    <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check("Xem danh sách thuộc tính")): ?>
                        <li class="nav-item has-treeview">
                            <a href="/type" class="nav-link">
                                <i class="nav-icon fas fa-file"></i>
                                <p>Thuộc tính</p>
                            </a>
                        </li>
                    <?php endif; ?>
                <?php endif; ?>

                <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->any(["Xem danh sách phân quyền","Xem lịch sử truy cập","Xem danh sách tài khoản"])): ?>
                    <li class="nav-header">Quản lí người dùng</li>
                    <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check("Xem danh sách phân quyền")): ?>
                        <li class="nav-item has-treeview">
                            <a href="<?php echo e(route('role.index')); ?>" class="nav-link">
                                <i class="nav-icon fa fa-hashtag"></i>
                                <p>Phân quyền </p>
                            </a>
                        </li>
                    <?php endif; ?>
                    <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check("Xem lịch sử truy cập")): ?>
                        <li class="nav-item has-treeview">
                            <a href="<?php echo e(route('user_log.index')); ?>" class="nav-link">
                                <i class="nav-icon fa fa-history"></i>
                                <p>Xem lịch sử truy cập</p>
                            </a>
                        </li>
                    <?php endif; ?>
                    <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check("Xem danh sách tài khoản")): ?>
                        <li class="nav-item has-treeview">
                            <a href="<?php echo e(route('user.index')); ?>" class="nav-link">
                                <i class="nav-icon fas fa-user"></i>
                                <p>Tài khoản </p>
                            </a>
                        </li>
                    <?php endif; ?>
                <?php endif; ?>
            </ul>
        </nav>
        <!-- /.sidebar-menu -->
    </div>
    <!-- /.sidebar -->
</aside>
<?php /**PATH /home/u483135680/domains/cecics.com/public_html/cms/resources/views/layouts/sidebar.blade.php ENDPATH**/ ?>