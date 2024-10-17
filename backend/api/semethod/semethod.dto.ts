/**
 * DTO for Claim
 */
export class ClaimDTO {
  name: string;
}

/**
 * DTO for SeMethod
 */
export class SeMethodDTO {
  name: string;
  claims: ClaimDTO[];
}
