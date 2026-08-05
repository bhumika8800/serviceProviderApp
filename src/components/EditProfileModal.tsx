import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../utils/constants';
import { Input } from './common/Input';
import { Button } from './common/Button';
import { validateEmail } from '../utils/validators';

interface EditProfileModalProps {
  visible: boolean;
  initial: { firstName: string; lastName: string; email?: string };
  onClose: () => void;
  onSave: (data: { firstName: string; lastName: string; email?: string }) => void;
}

export function EditProfileModal({
  visible,
  initial,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; email?: string }>({});

  useEffect(() => {
    if (visible) {
      setFirstName(initial.firstName);
      setLastName(initial.lastName);
      setEmail(initial.email ?? '');
      setErrors({});
    }
  }, [visible, initial]);

  const handleSave = () => {
    const nextErrors: { firstName?: string; lastName?: string; email?: string } = {};
    if (!firstName.trim()) {
      nextErrors.firstName = 'First name is required.';
    }
    if (!lastName.trim()) {
      nextErrors.lastName = 'Last name is required.';
    }
    if (email.trim() && !validateEmail(email)) {
      nextErrors.email = 'Enter a valid email address.';
    }
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSave({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim() || undefined,
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheet}
        >
          <View style={styles.handle} />
          <ScrollView
            contentContainerStyle={styles.sheetContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>Edit Profile</Text>
            <Text style={styles.subtitle}>
              Update your personal information
            </Text>

            <View style={styles.form}>
              <Input
                label="First Name"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First name"
                error={errors.firstName}
              />
              <Input
                label="Last Name"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last name"
                error={errors.lastName}
              />
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />
            </View>

            <View style={styles.actions}>
              <View style={styles.actionButton}>
                <Button title="Cancel" onPress={onClose} variant="ghost" />
              </View>
              <View style={styles.actionButton}>
                <Button title="Save Changes" onPress={handleSave} />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '85%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: borderRadius.full,
    backgroundColor: colors.border,
    marginTop: spacing.sm,
  },
  sheetContent: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
    marginBottom: spacing.lg,
  },
  form: {
    gap: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  actionButton: {
    flex: 1,
  },
});
