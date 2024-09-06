import { zodResolver } from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import * as Yup from 'yup';

const profileSchema = Yup.object({
    name:Yup.string().nullable(),
    photo:Yup.string().nullable()
});

export const useProfileValidation = () => useForm({
    resolver: zodResolver(profileSchema)
});

const profilePasswordSchema = Yup.object({
    password:Yup.string().nullable(),   
});

export const useProfilePasswordValidation = () => useForm({
    resolver: zodResolver(profilePasswordSchema)
});