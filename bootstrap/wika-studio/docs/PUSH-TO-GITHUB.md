# Publicar en GitHub

El repo remoto `wika-labss/wika-studio` debe recibir el contenido de este monorepo.

Desde tu máquina (con `gh` autenticado en la org):

```bash
git remote add origin https://github.com/wika-labss/wika-studio.git
git push -u origin main
```

Si el remoto ya tiene un commit vacío:

```bash
git pull origin main --allow-unrelated-histories
git push origin main
```

**Cloud agents:** añade al bot de Cursor como colaborador del repo privado, o ejecuta el push tú mismo.
