<?php
if (!defined('ABSPATH')) {
    exit;
}

// 处理表单提交
if (isset($_POST['action']) && $_POST['action'] === 'mark_as_knowledge') {
    check_admin_referer('mark_knowledge_nonce');
    
    $post_ids = array_map('intval', $_POST['post_ids'] ?? array());
    foreach ($post_ids as $post_id) {
        update_post_meta($post_id, '_is_curtain_wall_knowledge', '1');
    }
    
    echo '<div class="notice notice-success"><p>已成功标记 ' . count($post_ids) . ' 篇文章为幕墙知识！</p></div>';
}

if (isset($_POST['action']) && $_POST['action'] === 'unmark_as_knowledge') {
    check_admin_referer('unmark_knowledge_nonce');
    
    $post_ids = array_map('intval', $_POST['post_ids'] ?? array());
    foreach ($post_ids as $post_id) {
        delete_post_meta($post_id, '_is_curtain_wall_knowledge');
    }
    
    echo '<div class="notice notice-success"><p>已取消 ' . count($post_ids) . ' 篇文章的幕墙知识标记！</p></div>';
}

// 获取分页参数
$paged = isset($_GET['paged']) ? max(1, intval($_GET['paged'])) : 1;
$per_page = 20;

// 获取已标记为幕墙知识的文章
$knowledge_posts = get_posts(array(
    'meta_key' => '_is_curtain_wall_knowledge',
    'meta_value' => '1',
    'post_type' => 'post',
    'numberposts' => -1
));

$knowledge_post_ids = array_map(function($post) { return $post->ID; }, $knowledge_posts);

// 获取所有文章（分页）
$all_posts_query = new WP_Query(array(
    'post_type' => 'post',
    'post_status' => 'publish',
    'posts_per_page' => $per_page,
    'paged' => $paged,
    'orderby' => 'date',
    'order' => 'DESC'
));

$all_posts = $all_posts_query->posts;
$total_posts = $all_posts_query->found_posts;
$total_pages = $all_posts_query->max_num_pages;
?>

<div class="wrap">
    <h1>幕墙知识管理</h1>
    
    <div class="card">
        <h2>管理说明</h2>
        <p>在这里您可以管理哪些WordPress文章显示在幕墙知识库中。选择文章并标记为"幕墙知识"后，这些文章将在前端的幕墙知识功能中显示。</p>
        <div class="notice notice-info">
            <p><strong>建议：</strong></p>
            <ul>
                <li>为幕墙知识文章添加相应的分类和标签，以便用户更好地筛选和查找</li>
                <li>使用特色图片来增强文章的视觉效果</li>
                <li>文章内容应包含专业的幕墙技术知识</li>
                <li>定期更新和维护知识库内容</li>
            </ul>
        </div>
    </div>
    
    <h2>已标记为幕墙知识的文章 (<?php echo count($knowledge_posts); ?>)</h2>
    
    <?php if (!empty($knowledge_posts)): ?>
    <form method="post" action="">
        <?php wp_nonce_field('unmark_knowledge_nonce'); ?>
        <input type="hidden" name="action" value="unmark_as_knowledge">
        
        <div class="tablenav top">
            <div class="alignleft actions">
                <input type="submit" class="button action" value="取消幕墙知识标记" onclick="return confirm('确定要取消选中文章的幕墙知识标记吗？')">
            </div>
        </div>
        
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <td class="manage-column column-cb check-column">
                        <input type="checkbox" id="select-all-knowledge">
                    </td>
                    <th class="manage-column">标题</th>
                    <th class="manage-column">分类</th>
                    <th class="manage-column">标签</th>
                    <th class="manage-column">作者</th>
                    <th class="manage-column">发布日期</th>
                    <th class="manage-column">操作</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($knowledge_posts as $post): ?>
                <tr>
                    <th class="check-column">
                        <input type="checkbox" name="post_ids[]" value="<?php echo $post->ID; ?>">
                    </th>
                    <td>
                        <strong><?php echo esc_html($post->post_title); ?></strong>
                        <?php if (has_post_thumbnail($post->ID)): ?>
                        <span class="dashicons dashicons-format-image" style="color: green;" title="有特色图片"></span>
                        <?php endif; ?>
                    </td>
                    <td>
                        <?php
                        $categories = get_the_category($post->ID);
                        if (!empty($categories)) {
                            $cat_names = array_map(function($cat) { return $cat->name; }, $categories);
                            echo esc_html(implode(', ', $cat_names));
                        } else {
                            echo '<span style="color: #999;">无分类</span>';
                        }
                        ?>
                    </td>
                    <td>
                        <?php
                        $tags = get_the_tags($post->ID);
                        if (!empty($tags)) {
                            $tag_names = array_map(function($tag) { return $tag->name; }, $tags);
                            echo esc_html(implode(', ', $tag_names));
                        } else {
                            echo '<span style="color: #999;">无标签</span>';
                        }
                        ?>
                    </td>
                    <td><?php echo get_the_author_meta('display_name', $post->post_author); ?></td>
                    <td><?php echo get_the_date('Y-m-d H:i', $post->ID); ?></td>
                    <td>
                        <a href="<?php echo get_edit_post_link($post->ID); ?>" class="button button-small">编辑</a>
                        <a href="<?php echo get_permalink($post->ID); ?>" class="button button-small" target="_blank">查看</a>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </form>
    <?php else: ?>
    <p>暂无已标记的幕墙知识文章。请在下方选择文章进行标记。</p>
    <?php endif; ?>
    
    <h2>所有文章</h2>
    
    <form method="post" action="">
        <?php wp_nonce_field('mark_knowledge_nonce'); ?>
        <input type="hidden" name="action" value="mark_as_knowledge">
        
        <div class="tablenav top">
            <div class="alignleft actions">
                <input type="submit" class="button button-primary" value="标记为幕墙知识" onclick="return confirm('确定要将选中的文章标记为幕墙知识吗？')">
            </div>
            <div class="tablenav-pages">
                <?php
                $page_links = paginate_links(array(
                    'base' => add_query_arg('paged', '%#%'),
                    'format' => '',
                    'prev_text' => '&laquo;',
                    'next_text' => '&raquo;',
                    'total' => $total_pages,
                    'current' => $paged
                ));
                if ($page_links) {
                    echo '<span class="displaying-num">' . sprintf('%s 项', number_format_i18n($total_posts)) . '</span>';
                    echo $page_links;
                }
                ?>
            </div>
        </div>
        
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <td class="manage-column column-cb check-column">
                        <input type="checkbox" id="select-all-posts">
                    </td>
                    <th class="manage-column">标题</th>
                    <th class="manage-column">分类</th>
                    <th class="manage-column">标签</th>
                    <th class="manage-column">作者</th>
                    <th class="manage-column">发布日期</th>
                    <th class="manage-column">状态</th>
                    <th class="manage-column">操作</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($all_posts as $post): ?>
                <tr <?php echo in_array($post->ID, $knowledge_post_ids) ? 'style="background-color: #f0f8ff;"' : ''; ?>>
                    <th class="check-column">
                        <input type="checkbox" name="post_ids[]" value="<?php echo $post->ID; ?>" 
                               <?php echo in_array($post->ID, $knowledge_post_ids) ? 'disabled' : ''; ?>>
                    </th>
                    <td>
                        <strong><?php echo esc_html($post->post_title); ?></strong>
                        <?php if (in_array($post->ID, $knowledge_post_ids)): ?>
                        <span class="dashicons dashicons-yes-alt" style="color: green;" title="已标记为幕墙知识"></span>
                        <?php endif; ?>
                        <?php if (has_post_thumbnail($post->ID)): ?>
                        <span class="dashicons dashicons-format-image" style="color: orange;" title="有特色图片"></span>
                        <?php endif; ?>
                    </td>
                    <td>
                        <?php
                        $categories = get_the_category($post->ID);
                        if (!empty($categories)) {
                            $cat_names = array_map(function($cat) { return $cat->name; }, $categories);
                            echo esc_html(implode(', ', $cat_names));
                        } else {
                            echo '<span style="color: #999;">无分类</span>';
                        }
                        ?>
                    </td>
                    <td>
                        <?php
                        $tags = get_the_tags($post->ID);
                        if (!empty($tags)) {
                            $tag_names = array_map(function($tag) { return $tag->name; }, $tags);
                            echo esc_html(implode(', ', $tag_names));
                        } else {
                            echo '<span style="color: #999;">无标签</span>';
                        }
                        ?>
                    </td>
                    <td><?php echo get_the_author_meta('display_name', $post->post_author); ?></td>
                    <td><?php echo get_the_date('Y-m-d H:i', $post->ID); ?></td>
                    <td>
                        <?php if (in_array($post->ID, $knowledge_post_ids)): ?>
                        <span style="color: green; font-weight: bold;">已标记</span>
                        <?php else: ?>
                        <span style="color: #666;">未标记</span>
                        <?php endif; ?>
                    </td>
                    <td>
                        <a href="<?php echo get_edit_post_link($post->ID); ?>" class="button button-small">编辑</a>
                        <a href="<?php echo get_permalink($post->ID); ?>" class="button button-small" target="_blank">查看</a>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        
        <div class="tablenav bottom">
            <div class="alignleft actions">
                <input type="submit" class="button button-primary" value="标记为幕墙知识" onclick="return confirm('确定要将选中的文章标记为幕墙知识吗？')">
            </div>
            <div class="tablenav-pages">
                <?php
                if ($page_links) {
                    echo '<span class="displaying-num">' . sprintf('%s 项', number_format_i18n($total_posts)) . '</span>';
                    echo $page_links;
                }
                ?>
            </div>
        </div>
    </form>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // 全选功能
    document.getElementById('select-all-knowledge')?.addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('input[name="post_ids[]"]:not([disabled])');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });

    document.getElementById('select-all-posts')?.addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('input[name="post_ids[]"]:not([disabled])');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });
});
</script>

<style>
.card {
    background: #fff;
    border: 1px solid #ccd0d4;
    border-radius: 4px;
    padding: 20px;
    margin: 20px 0;
}

.notice ul {
    margin: 0.5em 0;
    padding-left: 2em;
}

.notice li {
    margin: 0.25em 0;
}

tr[style*="background-color"] {
    border-left: 4px solid #00a0d2;
}

.dashicons {
    font-size: 16px;
    width: 16px;
    height: 16px;
}
</style>
