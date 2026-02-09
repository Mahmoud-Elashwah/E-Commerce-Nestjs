import {
  BadRequestException,
  Body,
  HttpException,
  Injectable,
  NotFoundException,
  Req,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { NotFoundError } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existUser) {
      throw new BadRequestException('User already exists');
    }
    const { password, ...data } = createUserDto;
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = await this.userModel.create({
      ...data,
      password: hashPassword,
      role: createUserDto.role ?? 'user',
      active: true,
    });
    return {
      status: 'success',
      message: 'user created successfully',
      data: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        age: newUser.age,
        phoneNumber: newUser.phoneNumber,
        address: newUser.address,
        active: newUser.active,
        VerificationCode: newUser.VerificationCode,
        gender: newUser.gender,
      },
    };
  }

  async findAll(query: any) {
    const { select, sort, page = 1, limit = 10, ...filter } = query;

    let dbQuery = this.userModel.find(filter);

    if (select) {
      const fields = select.split(',').join(' ');
      dbQuery = dbQuery.select(fields);
    }

    if (sort) {
      const sortBy = sort.split(',').join(' ');
      dbQuery = dbQuery.sort(sortBy);
    } else {
      dbQuery = dbQuery.sort('-createdAt');
    }

    const skip = (page - 1) * limit;
    dbQuery = dbQuery.skip(skip).limit(limit);

    const users = await dbQuery.exec();

    return {
      status: 'success',
      results: users.length,
      page: page,
      limit: limit,
      data: users,
    };
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).select('-password -__v');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      status: 'success',
      data: user,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { password, ...safeData } = updateUserDto;

    const user = await this.userModel.findByIdAndUpdate(id, safeData, {
      new: true,
      runValidators: true,
      select: '-password -__v',
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      status: 'success',
      message: 'User updated successfully',
      data: user,
    };
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      status: 'success',
      message: 'User deleted successfully',
    };
  }

  async getMe(payload) {
    3;
    const user = await this.userModel
      .findById(payload._id)
      .select('-password -__v');
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      status: 'success',
      data: user,
    };
  }
}
