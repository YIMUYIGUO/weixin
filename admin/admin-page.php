<?php
if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="wrap">
    <h1>材料计算助手</h1>
    
    <div class="card">
        <h2>插件概述</h2>
        <p>材料计算助手是一个综合性的建筑材料计算工具，包含以下功能：</p>
        <ul>
            <li><strong>条材套裁优化</strong> - 智能计算最优切割方案</li>
            <li><strong>材料重量查询</strong> - 精确查询各种型材理论重量</li>
            <li><strong>幕墙知识库</strong> - 基于WordPress文章的专业知识管理</li>
        </ul>
    </div>
    
    <div class="card">
        <h2>短代码使用</h2>
        <p>在页面或文章中使用以下短代码来显示相应功能：</p>
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>功能</th>
                    <th>短代码</th>
                    <th>说明</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>首页</td>
                    <td><code>[material_calculator_home]</code></td>
                    <td>显示工具首页，包含所有功能入口</td>
                </tr>
                <tr>
                    <td>条材套裁优化</td>
                    <td><code>[cutting_optimizer]</code></td>
                    <td>条材切割优化计算工具</td>
                </tr>
                <tr>
                    <td>材料重量查询</td>
                    <td><code>[weight_calculator]</code></td>
                    <td>各种型材重量查询工具</td>
                </tr>
                <tr>
                    <td>幕墙知识</td>
                    <td><code>[curtain_wall_knowledge]</code></td>
                    <td>幕墙专业知识库（基于WordPress文章）</td>
                </tr>
            </tbody>
        </table>
    </div>
    
    <div class="card">
        <h2>数据统计</h2>
        <?php
        global $wpdb;
        $records_table = $wpdb->prefix . 'material_cutting_records';
        $total_records = $wpdb->get_var("SELECT COUNT(*) FROM $records_table");
        
        $curtain_wall_posts = get_posts(array(
            'meta_key' => '_is_curtain_wall_knowledge',
            'meta_value' => '1',
            'post_type' => 'post',
            'numberposts' => -1
        ));
        $total_knowledge = count($curtain_wall_posts);
        
        $total_posts = wp_count_posts()->publish;
        ?>
        <p><strong>套裁计算记录：</strong> <?php echo $total_records; ?> 条</p>
        <p><strong>幕墙知识文章：</strong> <?php echo $total_knowledge; ?> 篇</p>
        <p><strong>网站总文章数：</strong> <?php echo $total_posts; ?> 篇</p>
    </div>
    
    <div class="card">
        <h2>快速操作</h2>
        <p>
            <a href="<?php echo admin_url('admin.php?page=material-curtain-wall'); ?>" class="button button-primary">
                管理幕墙知识文章
            </a>
            <a href="<?php echo admin_url('post-new.php'); ?>" class="button button-secondary">
                添加新文章
            </a>
            <a href="<?php echo admin_url('edit-tags.php?taxonomy=category'); ?>" class="button button-secondary">
                管理分类
            </a>
        </p>
    </div>
</div>
