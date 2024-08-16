"use client"

import { createSupabaseClientSide } from '@/lib/supabase/supabase-client-side';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

interface ExtendedUser extends User {
  organization_id?: string;
  team_id?: string;
}

const AuthContext = createContext<{
    user: ExtendedUser | null;
    login: (values: TValue) => Promise<void>;
    logout: () => Promise<void>;
    isAuthChecked: boolean;
    updateUserAvatar: (avatarUrl: string) => Promise<void>;
}>({
    user: null,
    login: async () => {},
    logout: async () => {},
    isAuthChecked: false,
    updateUserAvatar: async () => {}
});

export const useAuth = () => useContext(AuthContext);

type TValue = { email: string; password: string; }

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<ExtendedUser | null>(null);
    const [isAuthChecked, setAuthChecked] = useState(false);
    const router = useRouter();

    const login = async (values: TValue) => {
        const supabase = createSupabaseClientSide();
        const { data, error } = await supabase.auth.signInWithPassword(values);

        if (error) {
            console.error('Login error:', error);
            return;
        }

        if (data.user) {
            const { data: teamData, error: teamError } = await supabase
                .from('teams')
                .select('organization_id, id')
                .eq('user_id', data.user.id)
                .single();

            if (teamError) {
                console.error('Error fetching team data:', teamError);
                setUser(data.user);
            } else if (teamData) {
                setUser({
                    ...data.user,
                    organization_id: teamData.organization_id,
                    team_id: teamData.id
                });
            } else {
                console.warn('No team data found for user:', data.user.id);
                setUser(data.user);
            }
        }

        setAuthChecked(true);
        router.push('/');
    };

    const logout = async () => {
        const supabase = createSupabaseClientSide();
        await supabase.auth.signOut();
        setUser(null);
        router.push('/login');
    };

    const updateUserAvatar = async (avatarUrl: string) => {
        if (user) {
            const supabase = createSupabaseClientSide();
            const { data, error } = await supabase
                .from('profiles')
                .update({ avatar_url: avatarUrl })
                .eq('id', user.id);

            if (!error && data) {
                setUser({ ...user, avatar_url: avatarUrl });
            }
        }
    };

    const fetchUserTeamData = async (authUser: User) => {
        const supabase = createSupabaseClientSide();
        const { data, error } = await supabase
            .from('teams')
            .select('id, organization_id')
            .eq('user_id', authUser.id)
            .single();

        if (error) {
            console.error('Error fetching team data:', error);
            setUser(authUser);
        } else if (data) {
            setUser({
                ...authUser,
                organization_id: data.organization_id,
                team_id: data.id
            });
        } else {
            console.warn('No team data found for user:', authUser.id);
            setUser(authUser);
        }
        setAuthChecked(true);
    };

    useEffect(() => {
        const supabase = createSupabaseClientSide();
        
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                fetchUserTeamData(session.user);
            } else {
                setAuthChecked(true);
                router.push('/login');
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                fetchUserTeamData(session.user);
            } else {
                setUser(null);
                setAuthChecked(true);
                router.push('/login');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthChecked, updateUserAvatar }}>
            {children}
        </AuthContext.Provider>
    );
};