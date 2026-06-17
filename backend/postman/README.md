# Postman

Import these files into [Postman](https://www.postman.com/downloads/):

| File | Purpose |
|------|---------|
| `School-CRM-API.postman_collection.json` | All 70 API endpoints |
| `School-CRM-Local.postman_environment.json` | `baseUrl`, `adminEmail`, `adminPassword`, `accessToken` |

## Steps

1. **Import** → both JSON files
2. Select environment **School CRM — Local**
3. Set `adminPassword` in environment (your admin password from `db:setup`)
4. Run **Auth → Login**
5. Test any endpoint — Bearer token is set automatically

Full docs: [`docs/API_REFERENCE.md`](../../docs/API_REFERENCE.md)
