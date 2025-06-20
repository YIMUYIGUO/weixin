<?php
/**
 * Plugin Name: 材料计算助手
 * Plugin URI: https://your-website.com
 * Description: 智能化条材套裁优化、精确材料重量查询和幕墙知识管理工具
 * Version: 1.0.0
 * Author: Your Name
 * License: GPL v2 or later
 * Text Domain: material-calculator
 */

// 防止直接访问
if (!defined('ABSPATH')) {
    exit;
}

// 定义插件常量
define('MATERIAL_CALCULATOR_VERSION', '1.0.0');
define('MATERIAL_CALCULATOR_PLUGIN_URL', plugin_dir_url(__FILE__));
define('MATERIAL_CALCULATOR_PLUGIN_PATH', plugin_dir_path(__FILE__));

// 主插件类
class MaterialCalculatorPlugin {
    
    public function __construct() {
        add_action('init', array($this, 'init'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        
        // AJAX处理
        add_action('wp_ajax_get_curtain_wall_posts', array($this, 'get_curtain_wall_posts'));
        add_action('wp_ajax_nopriv_get_curtain_wall_posts', array($this, 'get_curtain_wall_posts'));
        add_action('wp_ajax_save_cutting_record', array($this, 'save_cutting_record'));
        add_action('wp_ajax_get_cutting_records', array($this, 'get_cutting_records'));
        add_action('wp_ajax_delete_cutting_record', array($this, 'delete_cutting_record'));
        
        // 创建数据库表和分类
        register_activation_hook(__FILE__, array($this, 'create_tables'));
        register_activation_hook(__FILE__, array($this, 'create_post_categories'));
        register_activation_hook(__FILE__, array($this, 'create_sample_posts'));
    }
    
    public function init() {
        // 添加短代码支持
        add_shortcode('material_calculator_home', array($this, 'render_home'));
        add_shortcode('cutting_optimizer', array($this, 'render_cutting_optimizer'));
        add_shortcode('weight_calculator', array($this, 'render_weight_calculator'));
        add_shortcode('curtain_wall_knowledge', array($this, 'render_curtain_wall_knowledge'));
        
        // 加载文本域
        load_plugin_textdomain('material-calculator', false, dirname(plugin_basename(__FILE__)) . '/languages');
    }
    
    public function enqueue_scripts() {
        // 只在包含短代码的页面加载脚本
        global $post;
        if (is_a($post, 'WP_Post') && (
            has_shortcode($post->post_content, 'material_calculator_home') ||
            has_shortcode($post->post_content, 'cutting_optimizer') ||
            has_shortcode($post->post_content, 'weight_calculator') ||
            has_shortcode($post->post_content, 'curtain_wall_knowledge')
        )) {
            
            wp_enqueue_script(
                'material-calculator-react',
                MATERIAL_CALCULATOR_PLUGIN_URL . 'assets/js/material-calculator.js',
                array('wp-element'),
                MATERIAL_CALCULATOR_VERSION,
                true
            );
            
            wp_enqueue_style(
                'material-calculator-css',
                MATERIAL_CALCULATOR_PLUGIN_URL . 'assets/css/material-calculator.css',
                array(),
                MATERIAL_CALCULATOR_VERSION
            );
            
            // 传递数据到前端
            wp_localize_script('material-calculator-react', 'materialCalculatorAjax', array(
                'ajaxurl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('material_calculator_nonce'),
                'pluginUrl' => MATERIAL_CALCULATOR_PLUGIN_URL,
                'currentUser' => array(
                    'id' => get_current_user_id(),
                    'name' => wp_get_current_user()->display_name,
                    'role' => current_user_can('manage_options') ? 'admin' : 'user'
                )
            ));
        }
    }
    
    public function create_tables() {
        global $wpdb;
        
        $charset_collate = $wpdb->get_charset_collate();
        
        // 计算记录表
        $records_table = $wpdb->prefix . 'material_cutting_records';
        $records_sql = "CREATE TABLE $records_table (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            user_id bigint(20) NOT NULL,
            record_name varchar(255) NOT NULL,
            material_length int(11) NOT NULL,
            saw_width int(11) NOT NULL,
            required_lengths longtext NOT NULL,
            cutting_plans longtext NOT NULL,
            total_waste int(11) NOT NULL,
            average_utilization decimal(5,2) NOT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($records_sql);
    }
    
    public function create_post_categories() {
        // 创建幕墙知识分类
        $categories = array(
            '安装节点' => '幕墙安装节点技术要点',
            '防雷系统' => '幕墙防雷系统设计与施工',
            '转接件' => '幕墙转接件安装技术',
            '密封胶' => '幕墙密封胶使用规范',
            '结构胶' => '幕墙结构胶施工要点',
            '五金配件' => '幕墙五金配件选择与安装',
            '玻璃选型' => '幕墙玻璃材料选型指南',
            '铝型材' => '幕墙铝型材技术规范',
            '石材幕墙' => '石材幕墙设计与施工',
            '金属幕墙' => '金属幕墙技术要点',
            '玻璃幕墙' => '玻璃幕墙工程技术',
            '质量控制' => '幕墙工程质量控制',
            '安全施工' => '幕墙施工安全管理',
            '维护保养' => '幕墙维护保养指南'
        );
        
        foreach ($categories as $name => $description) {
            if (!term_exists($name, 'category')) {
                wp_insert_term($name, 'category', array(
                    'description' => $description,
                    'slug' => sanitize_title($name)
                ));
            }
        }
    }
    
    public function create_sample_posts() {
        // 检查是否已存在示例文章
        $existing = get_posts(array(
            'meta_key' => '_material_calculator_sample',
            'meta_value' => '1',
            'post_type' => 'post',
            'numberposts' => 1
        ));
        
        if (!empty($existing)) {
            return; // 已存在示例文章
        }
        
        $sample_posts = array(
            array(
                'title' => '幕墙防雷系统设计要点',
                'content' => '幕墙防雷系统应包括接闪器、引下线和接地装置三个基本组成部分。

## 接闪器设计

接闪器通常采用避雷针、避雷带或避雷网，应根据建筑物的高度和重要性选择合适的类型。

### 设计原则
1. 接闪器应设置在建筑物的最高点
2. 保护范围应覆盖整个幕墙系统
3. 材料应具有良好的导电性和耐腐蚀性

## 引下线连接

引下线应与建筑物主体结构的钢筋连接，确保电气连续性。连接点应采用焊接或专用连接器。

### 技术要求
- 引下线截面积不小于50mm²
- 连接点应进行防腐处理
- 每隔18m设置一个连接点

## 接地装置要求

接地装置应符合建筑物防雷等级要求，接地电阻应满足相关标准规定。

**重要提示：** 幕墙金属框架应与建筑物防雷系统可靠连接，连接点间距不应大于18m。',
                'category' => '防雷系统',
                'tags' => array('防雷', '设计', '安全', '接闪器', '引下线')
            ),
            array(
                'title' => '幕墙转接件安装技术要求',
                'content' => '转接件是连接幕墙与主体结构的重要构件，其安装质量直接影响幕墙的安全性能。

## 安装前检查

安装前应检查预埋件位置、尺寸和标高，确保符合设计要求：

### 检查要点
1. **位置偏差**：预埋件位置偏差不应超过±20mm
2. **标高偏差**：标高偏差不应超过±10mm
3. **表面处理**：预埋件表面应清洁，无油污和锈蚀

## 连接方式

转接件与预埋件的连接应采用焊接或螺栓连接：

### 焊接连接
- 焊接质量应符合相关标准要求
- 焊缝应饱满，无气孔、夹渣等缺陷
- 焊接完成后应进行防腐处理

### 螺栓连接
- 应采用高强度螺栓
- 按设计要求施加预紧力
- 螺栓应有防松措施

## 质量验收

转接件安装完成后应进行隐蔽工程验收，确保安装质量符合要求。

### 验收标准
- 连接牢固，无松动现象
- 防腐处理到位
- 几何尺寸符合设计要求',
                'category' => '转接件',
                'tags' => array('转接件', '安装', '连接', '预埋件', '质量控制')
            ),
            array(
                'title' => '结构胶使用注意事项',
                'content' => '结构胶是幕墙系统的关键材料，正确使用对确保幕墙安全至关重要。

## 使用前准备

### 环境条件
- **温度要求**：施工环境温度应在5-40℃范围内
- **湿度控制**：相对湿度应小于80%
- **天气条件**：避免在雨天或大风天气施工

### 基材处理
- 粘接面应清洁、干燥
- 去除油污、灰尘等杂质
- 必要时进行表面处理

## 施工要点

### 配比与搅拌
1. **严格按配比混合**：双组分结构胶应严格按照厂家规定的配比进行混合
2. **搅拌均匀**：搅拌时间不少于3分钟，确保颜色均匀一致
3. **及时使用**：在规定时间内用完，避免超过适用期

### 施工控制
- **厚度控制**：胶层厚度应符合设计要求，一般为6-12mm
- **温度监控**：施工过程中应监控环境温度变化
- **质量检查**：定期检查胶的粘接强度

## 质量控制

### 检测要求
- 定期进行拉伸强度测试
- 检查胶层厚度均匀性
- 建立质量追溯体系

### 注意事项
**警告：** 结构胶固化期间不得移动或振动构件，固化时间应根据环境温度确定。

- 低温时固化时间延长
- 高温时应注意胶体流淌
- 做好施工记录和质量档案',
                'category' => '结构胶',
                'tags' => array('结构胶', '施工', '质量', '配比', '固化')
            ),
            array(
                'title' => '玻璃幕墙工程技术规范要点',
                'content' => '玻璃幕墙工程应严格按照相关技术规范进行设计、施工和验收。

## 设计要求

### 基本原则
- 应满足建筑功能和美观要求
- 考虑所在地区的气候条件
- 满足安全性、适用性和耐久性要求

### 性能要求
1. **气密性能**：应满足设计等级要求
2. **水密性能**：应通过相应等级的水密性试验
3. **抗风压性能**：应满足当地风荷载要求
4. **保温性能**：传热系数应符合节能标准

## 材料选择

### 玻璃选型
- **安全玻璃**：应采用钢化玻璃或夹层玻璃
- **节能玻璃**：宜采用Low-E玻璃或中空玻璃
- **厚度要求**：根据风荷载和跨度确定

### 框架材料
- **铝合金型材**：应符合相关标准要求
- **表面处理**：应进行阳极氧化或粉末喷涂
- **连接件**：应采用不锈钢材料

## 施工要点

### 安装顺序
1. 测量放线
2. 安装转接件
3. 安装立柱
4. 安装横梁
5. 安装玻璃面板
6. 密封处理

### 质量控制
- 严格按图施工
- 做好隐蔽工程验收
- 进行必要的性能检测

## 验收标准

### 外观质量
- 表面平整，无明显变形
- 密封胶条顺直，无断裂
- 玻璃安装牢固，无松动

### 性能检测
- 气密性、水密性检测
- 抗风压性能检测
- 平面内变形性能检测',
                'category' => '玻璃幕墙',
                'tags' => array('玻璃幕墙', '技术规范', '设计', '施工', '验收')
            )
        );
        
        foreach ($sample_posts as $post_data) {
            $category_term = get_term_by('name', $post_data['category'], 'category');
            
            $post_id = wp_insert_post(array(
                'post_title' => $post_data['title'],
                'post_content' => $post_data['content'],
                'post_status' => 'publish',
                'post_type' => 'post',
                'post_category' => $category_term ? array($category_term->term_id) : array()
            ));
            
            if ($post_id) {
                // 添加标签
                wp_set_post_tags($post_id, $post_data['tags']);
                
                // 标记为示例文章
                update_post_meta($post_id, '_material_calculator_sample', '1');
                
                // 标记为幕墙知识文章
                update_post_meta($post_id, '_is_curtain_wall_knowledge', '1');
            }
        }
    }
    
    public function get_curtain_wall_posts() {
        check_ajax_referer('material_calculator_nonce', 'nonce');
        
        $search = sanitize_text_field($_POST['search'] ?? '');
        $category = sanitize_text_field($_POST['category'] ?? '');
        $page = intval($_POST['page'] ?? 1);
        $per_page = 10;
        
        $args = array(
            'post_type' => 'post',
            'post_status' => 'publish',
            'posts_per_page' => $per_page,
            'paged' => $page,
            'meta_query' => array(
                array(
                    'key' => '_is_curtain_wall_knowledge',
                    'value' => '1',
                    'compare' => '='
                )
            )
        );
        
        if (!empty($search)) {
            $args['s'] = $search;
        }
        
        if (!empty($category) && $category !== 'all') {
            $args['category_name'] = $category;
        }
        
        $query = new WP_Query($args);
        $posts = array();
        
        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $post_id = get_the_ID();
                $categories = get_the_category($post_id);
                $tags = get_the_tags($post_id);
                
                // 获取特色图片
                $featured_image = '';
                if (has_post_thumbnail($post_id)) {
                    $featured_image = get_the_post_thumbnail_url($post_id, 'medium');
                }
                
                $posts[] = array(
                    'id' => $post_id,
                    'title' => get_the_title(),
                    'content' => get_the_content(),
                    'excerpt' => get_the_excerpt(),
                    'category' => !empty($categories) ? $categories[0]->name : '',
                    'tags' => !empty($tags) ? array_map(function($tag) { return $tag->name; }, $tags) : array(),
                    'author' => get_the_author(),
                    'date' => get_the_date('Y-m-d'),
                    'url' => get_permalink(),
                    'featured_image' => $featured_image
                );
            }
        }
        
        wp_reset_postdata();
        
        wp_send_json_success(array(
            'posts' => $posts,
            'total' => $query->found_posts,
            'pages' => $query->max_num_pages
        ));
    }
    
    public function save_cutting_record() {
        check_ajax_referer('material_calculator_nonce', 'nonce');
        
        if (!is_user_logged_in()) {
            wp_send_json_error(array('message' => '请先登录'));
            return;
        }
        
        global $wpdb;
        $table_name = $wpdb->prefix . 'material_cutting_records';
        
        $record_name = sanitize_text_field($_POST['record_name']);
        $material_length = intval($_POST['material_length']);
        $saw_width = intval($_POST['saw_width']);
        $required_lengths = sanitize_textarea_field($_POST['required_lengths']);
        $cutting_plans = sanitize_textarea_field($_POST['cutting_plans']);
        $total_waste = intval($_POST['total_waste']);
        $average_utilization = floatval($_POST['average_utilization']);
        
        $result = $wpdb->insert(
            $table_name,
            array(
                'user_id' => get_current_user_id(),
                'record_name' => $record_name,
                'material_length' => $material_length,
                'saw_width' => $saw_width,
                'required_lengths' => $required_lengths,
                'cutting_plans' => $cutting_plans,
                'total_waste' => $total_waste,
                'average_utilization' => $average_utilization
            )
        );
        
        if ($result) {
            wp_send_json_success(array('message' => '保存成功', 'id' => $wpdb->insert_id));
        } else {
            wp_send_json_error(array('message' => '保存失败'));
        }
    }
    
    public function get_cutting_records() {
        check_ajax_referer('material_calculator_nonce', 'nonce');
        
        if (!is_user_logged_in()) {
            wp_send_json_error(array('message' => '请先登录'));
            return;
        }
        
        global $wpdb;
        $table_name = $wpdb->prefix . 'material_cutting_records';
        
        $records = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM $table_name WHERE user_id = %d ORDER BY created_at DESC LIMIT 10",
            get_current_user_id()
        ));
        
        wp_send_json_success($records);
    }
    
    public function delete_cutting_record() {
        check_ajax_referer('material_calculator_nonce', 'nonce');
        
        if (!is_user_logged_in()) {
            wp_send_json_error(array('message' => '请先登录'));
            return;
        }
        
        global $wpdb;
        $table_name = $wpdb->prefix . 'material_cutting_records';
        $record_id = intval($_POST['record_id']);
        
        $result = $wpdb->delete(
            $table_name,
            array(
                'id' => $record_id,
                'user_id' => get_current_user_id()
            )
        );
        
        if ($result) {
            wp_send_json_success(array('message' => '删除成功'));
        } else {
            wp_send_json_error(array('message' => '删除失败'));
        }
    }
    
    public function add_admin_menu() {
        add_menu_page(
            '材料计算助手',
            '材料计算',
            'manage_options',
            'material-calculator',
            array($this, 'admin_page'),
            'dashicons-calculator',
            30
        );
        
        add_submenu_page(
            'material-calculator',
            '幕墙知识管理',
            '幕墙知识',
            'manage_options',
            'material-curtain-wall',
            array($this, 'curtain_wall_admin_page')
        );
    }
    
    public function render_home($atts) {
        return '<div id="material-calculator-home"></div>';
    }
    
    public function render_cutting_optimizer($atts) {
        return '<div id="cutting-optimizer-root"></div>';
    }
    
    public function render_weight_calculator($atts) {
        return '<div id="weight-calculator-root"></div>';
    }
    
    public function render_curtain_wall_knowledge($atts) {
        return '<div id="curtain-wall-knowledge-root"></div>';
    }
    
    public function admin_page() {
        include MATERIAL_CALCULATOR_PLUGIN_PATH . 'admin/admin-page.php';
    }
    
    public function curtain_wall_admin_page() {
        include MATERIAL_CALCULATOR_PLUGIN_PATH . 'admin/curtain-wall-admin.php';
    }
}

// 初始化插件
new MaterialCalculatorPlugin();
?>
