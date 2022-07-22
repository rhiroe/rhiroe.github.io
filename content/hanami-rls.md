---
title: PostgreSQLのRowLevelSecurityをHanamiから扱う
date: 2022/5/2
tags: ["Hanami", "PostgreSQL"]
---

新しいアプリケーションを開発するのに先んじての記述検証でPostgreSQLのRowLevelSecurityを採用することとなった。
経緯としては、toBのサービスをマルチテナントに提供する関係上、
アクセスできるデータベースを分けたほうが安全だが、
契約ごとにDBを作っていくのは管理コストがバカにならない。
またバックエンドに採用予定のhanamiが複数DBの利用に対応できていない。
そこで、DBを分けずに制約を設けて行ごとに分離できるRowLevelSecurityが折衷案として挙がった。

# Row Level Security

PostgreSQL9.5から提供される機能で、
