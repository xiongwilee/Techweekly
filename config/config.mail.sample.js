/**
 * 邮箱配置案例
 * @author xiongwilee
 */

module.exports = {
  "sender": {
    "host": "smtp.163.com",
    "port": 465,
    "auth": {
      "user": "wileetest04@163.com",
      "pass": "123qwe"
    }
  },
  "subject": "每周技术文章推荐",
  "from": "xiongwilee <wileetest04@163.com>",
  "to": ["xiongwilee@foxmail.com"]
}
