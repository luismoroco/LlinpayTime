from manage import conn

cur = conn.cursor()
cur.execute("SELECT * FROM task_memory_repo_val_inf")
res = cur.fetchone()
print(res)
