# 工作流相关的任务

## Task 1: 没有自动fetch issues的脚本

1. 请帮我实现自动fetch issues的脚本
2. 另外github action中的任务，是否可以调整到2个小时跑一次


## Task 2: 实现一个daemon进程，用于自动fetch issues

1. 请在这个mono repo中创建一个daemon进程，用于自动fetch issues
2. 这个daemon进程需要自己手动出发，同时如果触发了会在本地类似执行github action的工作，
   例如fetch issues，更新本地数据库，提交数据。
3. 这个实现在packages/ 这个目录中实现，可以采用cli模式，实现文档需要写入到docs/目录中，创建一个新目录中完成比如 task-watcher类似的名字
