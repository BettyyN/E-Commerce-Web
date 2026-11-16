import { z } from 'zod';

// Matches EmployeeAddDto
export const employeeAddSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email:    z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  roleId:   z.string().min(1, 'Role is required'),
});

// Matches EmployeeModDto (id handled separately)
export const employeeModSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email:    z.string().email('Invalid email address'),
});

export const accountSchema = z.object({
  name:   z.string().min(2, 'Name must be at least 2 characters'),
  email:  z.string().email('Invalid email address'),
  status: z.enum(['active', 'inactive']),
});

export type EmployeeAddFormValues = z.infer<typeof employeeAddSchema>;
export type EmployeeModFormValues = z.infer<typeof employeeModSchema>;
export type AccountFormValues     = z.infer<typeof accountSchema>;
