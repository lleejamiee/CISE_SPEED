import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
  } from '@nestjs/common';
  import { SeMethodService } from './semethod.service';
  import { SeMethodDTO, ClaimDTO } from './semethod.dto';
  import { Claim, SeMethod } from './semethod.schema';
  
  /**
   * Controller to handle SE Method related API requests.
   */
  @Controller('semethods')
  export class SeMethodController {
    constructor(private readonly seMethodService: SeMethodService) {}
  
    // Create a new SeMethod
    @Post()
    async createSeMethod(@Body() seMethodDto: SeMethodDTO): Promise<SeMethod> {
      return this.seMethodService.create(seMethodDto);
    }
  
    // Retrieve all SeMethods
    @Get()
    async getAllSeMethods(): Promise<SeMethod[]> {
      return this.seMethodService.findAll();
    }
  
    // Retrieve a single SeMethod by ID
    @Get(':id')
    async getSeMethod(@Param('id') id: string): Promise<SeMethod> {
      return this.seMethodService.findOne(id);
    }
  
    // Update a SeMethod by ID
    @Put(':id')
    async updateSeMethod(
      @Param('id') id: string,
      @Body() seMethodDto: Partial<SeMethodDTO>,
    ): Promise<SeMethod> {
      return this.seMethodService.update(id, seMethodDto);
    }
  
    // Delete a SeMethod by ID
    @Delete(':id')
    async deleteSeMethod(@Param('id') id: string): Promise<SeMethod> {
      return this.seMethodService.delete(id);
    }
  
    // Add a claim to the SeMethod
    @Post(':id/claims')
    async addClaim(
      @Param('id') seMethodId: string,
      @Body() claimDto: ClaimDTO,
    ): Promise<SeMethod> {
      return this.seMethodService.addClaim(seMethodId, claimDto);
    }
  
    // Retrieve all claims for a SeMethod
    @Get(':id/claims')
    async getAllClaims(@Param('id') seMethodId: string): Promise<Claim[]> {
      return this.seMethodService.getAllClaims(seMethodId);
    }
  
    // Retrieve a single claim by index
    @Get(':id/claims/:claimIndex')
    async getClaim(
      @Param('id') seMethodId: string,
      @Param('claimIndex') claimIndex: number,
    ): Promise<Claim> {
      return this.seMethodService.getClaim(seMethodId, claimIndex);
    }
  
    // Update a claim by index
    @Put(':id/claims/:claimIndex')
    async updateClaim(
      @Param('id') seMethodId: string,
      @Param('claimIndex') claimIndex: number,
      @Body() claimDto: ClaimDTO,
    ): Promise<SeMethod> {
      return this.seMethodService.updateClaim(seMethodId, claimIndex, claimDto);
    }
  
    // Delete a claim by index
    @Delete(':id/claims/:claimIndex')
    async deleteClaim(
      @Param('id') seMethodId: string,
      @Param('claimIndex') claimIndex: number,
    ): Promise<SeMethod> {
      return this.seMethodService.deleteClaim(seMethodId, claimIndex);
    }
  }
  