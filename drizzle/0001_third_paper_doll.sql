CREATE TABLE `audit_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`action` varchar(100) NOT NULL,
	`tableName` varchar(100),
	`recordId` int,
	`oldValues` json,
	`newValues` json,
	`ipAddress` varchar(45),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bairros` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(100) NOT NULL,
	`codigo` varchar(20),
	`municipioId` int,
	`latitude` varchar(20),
	`longitude` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bairros_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `candidatos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(200) NOT NULL,
	`nomeUrna` varchar(100),
	`numero` int NOT NULL,
	`partidoId` int,
	`cargo` varchar(50) NOT NULL,
	`anoEleicao` int NOT NULL,
	`municipioId` int,
	`situacao` varchar(50),
	`foto` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `candidatos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `demo_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dataType` varchar(50) NOT NULL,
	`dataContent` json,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `demo_data_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `eleitorado` (
	`id` int AUTO_INCREMENT NOT NULL,
	`anoEleicao` int NOT NULL,
	`municipioId` int,
	`bairroId` int,
	`zonaId` int,
	`secaoId` int,
	`totalEleitores` int DEFAULT 0,
	`eleitoresMasculino` int DEFAULT 0,
	`eleitoresFeminino` int DEFAULT 0,
	`eleitoresOutros` int DEFAULT 0,
	`faixa16a17` int DEFAULT 0,
	`faixa18a24` int DEFAULT 0,
	`faixa25a34` int DEFAULT 0,
	`faixa35a44` int DEFAULT 0,
	`faixa45a59` int DEFAULT 0,
	`faixa60a69` int DEFAULT 0,
	`faixa70mais` int DEFAULT 0,
	`escolaridadeAnalfabeto` int DEFAULT 0,
	`escolaridadeFundamental` int DEFAULT 0,
	`escolaridadeMedio` int DEFAULT 0,
	`escolaridadeSuperior` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `eleitorado_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `importacoes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`nomeArquivo` varchar(255) NOT NULL,
	`tipoArquivo` varchar(50) NOT NULL,
	`tipoDataset` varchar(50) NOT NULL,
	`totalRegistros` int DEFAULT 0,
	`registrosImportados` int DEFAULT 0,
	`registrosErro` int DEFAULT 0,
	`status` enum('pendente','processando','concluido','erro') DEFAULT 'pendente',
	`mensagemErro` text,
	`anoReferencia` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `importacoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `municipios` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(100) NOT NULL,
	`codigo` varchar(20),
	`regiaoId` int,
	`uf` varchar(2) DEFAULT 'RO',
	`latitude` varchar(20),
	`longitude` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `municipios_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `partidos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sigla` varchar(20) NOT NULL,
	`nome` varchar(200) NOT NULL,
	`numero` int NOT NULL,
	`cor` varchar(7),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `partidos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `regioes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(100) NOT NULL,
	`codigo` varchar(20),
	`uf` varchar(2) DEFAULT 'RO',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `regioes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `resultados_eleitorais` (
	`id` int AUTO_INCREMENT NOT NULL,
	`anoEleicao` int NOT NULL,
	`turno` int DEFAULT 1,
	`cargo` varchar(50) NOT NULL,
	`municipioId` int,
	`bairroId` int,
	`zonaId` int,
	`secaoId` int,
	`candidatoId` int,
	`partidoId` int,
	`votosValidos` int DEFAULT 0,
	`votosNominais` int DEFAULT 0,
	`votosLegenda` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `resultados_eleitorais_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `secoes_eleitorais` (
	`id` int AUTO_INCREMENT NOT NULL,
	`numero` int NOT NULL,
	`zonaId` int,
	`localVotacao` text,
	`bairroId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `secoes_eleitorais_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `system_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`settingKey` varchar(100) NOT NULL,
	`settingValue` text,
	`description` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `system_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `system_settings_settingKey_unique` UNIQUE(`settingKey`)
);
--> statement-breakpoint
CREATE TABLE `votos_nulos_brancos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`anoEleicao` int NOT NULL,
	`turno` int DEFAULT 1,
	`cargo` varchar(50) NOT NULL,
	`municipioId` int,
	`bairroId` int,
	`zonaId` int,
	`secaoId` int,
	`votosNulos` int DEFAULT 0,
	`votosBrancos` int DEFAULT 0,
	`abstencoes` int DEFAULT 0,
	`totalAptos` int DEFAULT 0,
	`comparecimento` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `votos_nulos_brancos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `zonas_eleitorais` (
	`id` int AUTO_INCREMENT NOT NULL,
	`numero` int NOT NULL,
	`nome` varchar(100),
	`municipioId` int,
	`endereco` text,
	`latitude` varchar(20),
	`longitude` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `zonas_eleitorais_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('admin','gestor','politico','demo') NOT NULL DEFAULT 'demo';--> statement-breakpoint
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bairros` ADD CONSTRAINT `bairros_municipioId_municipios_id_fk` FOREIGN KEY (`municipioId`) REFERENCES `municipios`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `candidatos` ADD CONSTRAINT `candidatos_partidoId_partidos_id_fk` FOREIGN KEY (`partidoId`) REFERENCES `partidos`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `candidatos` ADD CONSTRAINT `candidatos_municipioId_municipios_id_fk` FOREIGN KEY (`municipioId`) REFERENCES `municipios`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `eleitorado` ADD CONSTRAINT `eleitorado_municipioId_municipios_id_fk` FOREIGN KEY (`municipioId`) REFERENCES `municipios`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `eleitorado` ADD CONSTRAINT `eleitorado_bairroId_bairros_id_fk` FOREIGN KEY (`bairroId`) REFERENCES `bairros`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `eleitorado` ADD CONSTRAINT `eleitorado_zonaId_zonas_eleitorais_id_fk` FOREIGN KEY (`zonaId`) REFERENCES `zonas_eleitorais`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `eleitorado` ADD CONSTRAINT `eleitorado_secaoId_secoes_eleitorais_id_fk` FOREIGN KEY (`secaoId`) REFERENCES `secoes_eleitorais`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `importacoes` ADD CONSTRAINT `importacoes_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `municipios` ADD CONSTRAINT `municipios_regiaoId_regioes_id_fk` FOREIGN KEY (`regiaoId`) REFERENCES `regioes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `resultados_eleitorais` ADD CONSTRAINT `resultados_eleitorais_municipioId_municipios_id_fk` FOREIGN KEY (`municipioId`) REFERENCES `municipios`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `resultados_eleitorais` ADD CONSTRAINT `resultados_eleitorais_bairroId_bairros_id_fk` FOREIGN KEY (`bairroId`) REFERENCES `bairros`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `resultados_eleitorais` ADD CONSTRAINT `resultados_eleitorais_zonaId_zonas_eleitorais_id_fk` FOREIGN KEY (`zonaId`) REFERENCES `zonas_eleitorais`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `resultados_eleitorais` ADD CONSTRAINT `resultados_eleitorais_secaoId_secoes_eleitorais_id_fk` FOREIGN KEY (`secaoId`) REFERENCES `secoes_eleitorais`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `resultados_eleitorais` ADD CONSTRAINT `resultados_eleitorais_candidatoId_candidatos_id_fk` FOREIGN KEY (`candidatoId`) REFERENCES `candidatos`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `resultados_eleitorais` ADD CONSTRAINT `resultados_eleitorais_partidoId_partidos_id_fk` FOREIGN KEY (`partidoId`) REFERENCES `partidos`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `secoes_eleitorais` ADD CONSTRAINT `secoes_eleitorais_zonaId_zonas_eleitorais_id_fk` FOREIGN KEY (`zonaId`) REFERENCES `zonas_eleitorais`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `secoes_eleitorais` ADD CONSTRAINT `secoes_eleitorais_bairroId_bairros_id_fk` FOREIGN KEY (`bairroId`) REFERENCES `bairros`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `votos_nulos_brancos` ADD CONSTRAINT `votos_nulos_brancos_municipioId_municipios_id_fk` FOREIGN KEY (`municipioId`) REFERENCES `municipios`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `votos_nulos_brancos` ADD CONSTRAINT `votos_nulos_brancos_bairroId_bairros_id_fk` FOREIGN KEY (`bairroId`) REFERENCES `bairros`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `votos_nulos_brancos` ADD CONSTRAINT `votos_nulos_brancos_zonaId_zonas_eleitorais_id_fk` FOREIGN KEY (`zonaId`) REFERENCES `zonas_eleitorais`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `votos_nulos_brancos` ADD CONSTRAINT `votos_nulos_brancos_secaoId_secoes_eleitorais_id_fk` FOREIGN KEY (`secaoId`) REFERENCES `secoes_eleitorais`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `zonas_eleitorais` ADD CONSTRAINT `zonas_eleitorais_municipioId_municipios_id_fk` FOREIGN KEY (`municipioId`) REFERENCES `municipios`(`id`) ON DELETE no action ON UPDATE no action;