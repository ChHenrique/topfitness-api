-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Aluno" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuario_id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ALUNO',
    "nome" TEXT,
    "treino_dias_por_semana" INTEGER,
    "sobrenome" TEXT,
    "foto" TEXT NOT NULL,
    "sexo" TEXT NOT NULL DEFAULT 'PREFIRO_NAO_DIZER',
    "foco_treino" TEXT,
    "peso" REAL,
    "altura" REAL,
    "idade" INTEGER,
    "data_matricula" DATETIME,
    "email" TEXT,
    "senha" TEXT NOT NULL,
    "telefone" TEXT,
    "foco_corpo" TEXT,
    "plano_id" TEXT,
    "personal_id" TEXT,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacao" TEXT,
    "data_validade_plano" DATETIME NOT NULL,
    CONSTRAINT "Aluno_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Aluno_plano_id_fkey" FOREIGN KEY ("plano_id") REFERENCES "Plano" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Aluno_personal_id_fkey" FOREIGN KEY ("personal_id") REFERENCES "Personal" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Aluno" ("altura", "criado_em", "data_matricula", "data_validade_plano", "email", "foco_corpo", "foco_treino", "foto", "id", "idade", "nome", "observacao", "personal_id", "peso", "plano_id", "role", "senha", "sexo", "sobrenome", "telefone", "treino_dias_por_semana", "usuario_id") SELECT "altura", "criado_em", "data_matricula", "data_validade_plano", "email", "foco_corpo", "foco_treino", "foto", "id", "idade", "nome", "observacao", "personal_id", "peso", "plano_id", "role", "senha", "sexo", "sobrenome", "telefone", "treino_dias_por_semana", "usuario_id" FROM "Aluno";
DROP TABLE "Aluno";
ALTER TABLE "new_Aluno" RENAME TO "Aluno";
CREATE UNIQUE INDEX "Aluno_usuario_id_key" ON "Aluno"("usuario_id");
CREATE UNIQUE INDEX "Aluno_email_key" ON "Aluno"("email");
CREATE UNIQUE INDEX "Aluno_telefone_key" ON "Aluno"("telefone");
CREATE TABLE "new_AlunoTreino" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "aluno_id" TEXT NOT NULL,
    "treino_id" TEXT NOT NULL,
    CONSTRAINT "AlunoTreino_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "Aluno" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AlunoTreino_treino_id_fkey" FOREIGN KEY ("treino_id") REFERENCES "Treino" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AlunoTreino" ("aluno_id", "id", "treino_id") SELECT "aluno_id", "id", "treino_id" FROM "AlunoTreino";
DROP TABLE "AlunoTreino";
ALTER TABLE "new_AlunoTreino" RENAME TO "AlunoTreino";
CREATE TABLE "new_Treino" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "foco_corpo" TEXT NOT NULL,
    "foto" TEXT,
    "criador_id" TEXT NOT NULL,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Treino_criador_id_fkey" FOREIGN KEY ("criador_id") REFERENCES "Personal" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Treino" ("criado_em", "criador_id", "descricao", "foco_corpo", "foto", "id", "nome") SELECT "criado_em", "criador_id", "descricao", "foco_corpo", "foto", "id", "nome" FROM "Treino";
DROP TABLE "Treino";
ALTER TABLE "new_Treino" RENAME TO "Treino";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
