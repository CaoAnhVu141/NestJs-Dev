import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Company } from 'src/companies/schemas/company.schema';
import { Job } from 'src/jobs/schemas/job.schema';

export type ResumeDocument = HydratedDocument<Resume>;

@Schema({ timestamps: true })
export class Resume {
    @Prop()
    email: string;

    @Prop({ type: Object })
    userId: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    }

    @Prop()
    url: string;

    @Prop()
    status: string;

    // @Prop({ type: Object })
    // companyId: {
    //     _id: mongoose.Schema.Types.ObjectId;
    // };

    // @Prop({ type: Object })
    // jobId: {
    //     _id: mongoose.Schema.Types.ObjectId;
    // };

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Company.name })
    companyId: {
        _id: mongoose.Schema.Types.ObjectId;
    };

    @Prop({type: mongoose.Schema.Types.ObjectId,ref: Job.name})
    jobId: {
        _id: mongoose.Schema.Types.ObjectId;
    }

    @Prop()
    history:{
        status: string;
        updateAt: Date;
        updateBy: {
            _id: mongoose.Schema.Types.ObjectId;
            email: string;
        }
    } [];

    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    }

    @Prop({ type: Object })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    }

    @Prop({ type: Object })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    }

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    @Prop()
    isDeleted: boolean;

    @Prop()
    deletedAt: Date;
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);

