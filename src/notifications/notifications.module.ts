import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService, MAILER_SERVICE } from './services/notifications.service';
import { NotificationQueueService } from './services/notification-queue.service';
import { NotificationPreferencesService } from './services/notification-preferences.service';
import { OnChainEventListenerService } from './services/on-chain-event-listener.service';
import { WsAuthGuard } from './guards/ws-auth.guard';
import { NotificationPreference } from './entities/notification-preference.entity';
import { AuthModule } from '../auth/auth.module';

function buildMailerProvider() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { MailerService } = require('@nestjs-modules/mailer');
    return {
      provide: MAILER_SERVICE,
      useExisting: MailerService,
    };
  } catch {
    return null;
  }
}

const mailerProvider = buildMailerProvider();

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    TypeOrmModule.forFeature([NotificationPreference]),
  ],
  providers: [
    NotificationsGateway,
    NotificationsService,
    NotificationQueueService,
    NotificationPreferencesService,
    OnChainEventListenerService,
    WsAuthGuard,
    ...(mailerProvider ? [mailerProvider] : []),
  ],
  exports: [NotificationsService, NotificationPreferencesService, OnChainEventListenerService],
})
export class NotificationsModule {}
