import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Claim, SeMethod, SeMethodDocument } from './semethod.schema';
import { Model } from 'mongoose';
import { ClaimDTO, SeMethodDTO } from './semethod.dto';

/**
 * Service to manage SE method and claim data and business logic.
 */
@Injectable()
export class SeMethodService {
  constructor(
    @InjectModel(SeMethod.name) private seMethodModel: Model<SeMethodDocument>,
  ) {}

  // Create a new SeMethod
  async create(seMethodDto: SeMethodDTO): Promise<SeMethod> {
    const createdSeMethod = new this.seMethodModel(seMethodDto);
    return createdSeMethod.save();
  }

  // Retrieve all SeMethod
  async findAll(): Promise<SeMethod[]> {
    return this.seMethodModel.find().exec();
  }

  // Retrieve a single SeMethod by ID
  async findOne(id: string): Promise<SeMethod> {
    const seMethod = await this.seMethodModel.findById(id).exec();
    if (!seMethod) {
      throw new NotFoundException(`SeMethod with ID ${id} not found`);
    }
    return seMethod;
  }

  // Update an existing SeMethod
  async update(
    id: string,
    seMethodDto: Partial<SeMethodDTO>,
  ): Promise<SeMethod> {
    const updatedSeMethod = await this.seMethodModel
      .findByIdAndUpdate(id, seMethodDto, { new: true })
      .exec();

    if (!updatedSeMethod) {
      throw new NotFoundException(`SeMethod with ID ${id} not found`);
    }
    return updatedSeMethod;
  }

  // Delete a SeMethod by ID
  async delete(id: string): Promise<SeMethod> {
    const deletedSeMethod = await this.seMethodModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedSeMethod) {
      throw new NotFoundException(`SeMethod with ID ${id} not found`);
    }
    return deletedSeMethod;
  }

  // Add a claim to the SeMethod
  async addClaim(seMethodId: string, claimDto: ClaimDTO): Promise<SeMethod> {
    const seMethod = await this.seMethodModel.findById(seMethodId).exec();
    if (!seMethod) {
      throw new NotFoundException(`SeMethod with ID ${seMethodId} not found`);
    }
    seMethod.claims.push(claimDto);
    return seMethod.save();
  }

  // Retrieve all claims for a SeMethod
  async getAllClaims(seMethodId: string): Promise<Claim[]> {
    const seMethod = await this.seMethodModel.findById(seMethodId).exec();
    if (!seMethod) {
      throw new NotFoundException(`SeMethod with ID ${seMethodId} not found`);
    }
    return seMethod.claims; // Return claims array
  }

  // Retrieve a single claim
  async getClaim(seMethodId: string, claimIndex: number): Promise<Claim> {
    const seMethod = await this.seMethodModel.findById(seMethodId).exec();
    if (!seMethod) {
      throw new NotFoundException(`SeMethod with ID ${seMethodId} not found`);
    }
    const claim = seMethod.claims[claimIndex];
    if (!claim) {
      throw new NotFoundException(`Claim not found at index ${claimIndex}`);
    }
    return claim;
  }

  // Update a claim
  async updateClaim(
    seMethodId: string,
    claimIndex: number,
    claimDto: ClaimDTO,
  ): Promise<SeMethod> {
    const seMethod = await this.seMethodModel.findById(seMethodId).exec();
    if (!seMethod) {
      throw new NotFoundException(`SeMethod with ID ${seMethodId} not found`);
    }
    if (!seMethod.claims[claimIndex]) {
      throw new NotFoundException(`Claim not found at index ${claimIndex}`);
    }
    seMethod.claims[claimIndex] = claimDto; // Update the claim
    return seMethod.save();
  }

  // Delete a claim
  async deleteClaim(seMethodId: string, claimIndex: number): Promise<SeMethod> {
    const seMethod = await this.seMethodModel.findById(seMethodId).exec();
    if (!seMethod) {
      throw new NotFoundException(`SeMethod with ID ${seMethodId} not found`);
    }
    if (!seMethod.claims[claimIndex]) {
      throw new NotFoundException(`Claim not found at index ${claimIndex}`);
    }
    seMethod.claims.splice(claimIndex, 1); // Remove the claim
    return seMethod.save();
  }
}
