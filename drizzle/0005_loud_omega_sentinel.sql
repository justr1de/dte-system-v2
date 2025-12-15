CREATE TABLE `backup_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`scheduledBackupId` int,
	`status` enum('success','failed','running') DEFAULT 'running',
	`dataTypes` json,
	`recordCounts` json,
	`fileSize` int,
	`fileUrl` text,
	`errorMessage` text,
	`emailSent` boolean DEFAULT false,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `backup_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scheduled_backups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`dataTypes` json NOT NULL,
	`frequency` enum('daily','weekly','monthly') NOT NULL,
	`dayOfWeek` int,
	`dayOfMonth` int,
	`timeOfDay` varchar(5) DEFAULT '03:00',
	`emailRecipients` json,
	`format` enum('csv','json') DEFAULT 'csv',
	`isActive` boolean DEFAULT true,
	`lastRunAt` timestamp,
	`nextRunAt` timestamp,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `scheduled_backups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `backup_history` ADD CONSTRAINT `backup_history_scheduledBackupId_scheduled_backups_id_fk` FOREIGN KEY (`scheduledBackupId`) REFERENCES `scheduled_backups`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `scheduled_backups` ADD CONSTRAINT `scheduled_backups_createdBy_users_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;