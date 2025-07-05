import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Subscriber, SubscriberDocument } from 'src/subscribers/schema/subscriber.schema';
import { Job, JobDocument } from 'src/jobs/schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';
import { skip } from 'rxjs';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private mailerService: MailerService,

    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>,
    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>
  ) {

  }

  @Get()
  @Public()
  @ResponseMessage("Test email")
  async handleTestEmail() {
    const job = [{
      name: "Nguyen Bac",
      company: "Ruoi",
      salary: "100",
      skills: ["Haha", "Boc phet"]
    }];

    const subscribers = await this.subscriberModel.find({});
    for (const subs of subscribers) {
      const subsSkills = subs.skills;
      const jobWithMatchingSkills = await this.jobModel.find({ skills: { $in: subsSkills } });
      if (jobWithMatchingSkills?.length) {
        const job = jobWithMatchingSkills.map(item => {
          return {
            name: item.name,
            company: item.company.name,
            salary: `${item.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " đ",
            skills: item.skills
          }

        });

        await this.mailerService.sendMail({
          to: "caovu5541@gmail.com",
          from: '"Support Team" <support@example.com>',
          subject: 'Welcome to Nice App! Confirm your Email',
          template: "job",
          context: {
            receiver: subs.name,
            job: job,
          }
        });
      }
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  handleCron() {
    console.log('Called every 30 seconds');
  }

}
