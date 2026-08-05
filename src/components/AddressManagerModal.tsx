import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../utils/constants';
import { Input } from './common/Input';
import { Button } from './common/Button';
import { validatePincode } from '../utils/validators';
import { capitalize } from '../utils/formatters';
import type { Address } from '../types';

interface AddressManagerModalProps {
  visible: boolean;
  addresses: Address[];
  onClose: () => void;
  onAdd: (address: Omit<Address, 'id'>) => void;
  onUpdate: (address: Address) => void;
  onDelete: (id: string) => void;
}

type Label = Address['label'];
type AddressInput = Omit<Address, 'id'>;

const labelStyles: Record<Label, { bg: string; text: string }> = {
  home: { bg: colors.primaryBg, text: colors.primary },
  work: { bg: colors.accentBg, text: colors.accentDark },
  other: { bg: colors.successBg, text: colors.success },
};

const emptyForm: AddressInput = {
  label: 'home',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
  isDefault: false,
};

export function AddressManagerModal({
  visible,
  addresses,
  onClose,
  onAdd,
  onUpdate,
  onDelete,
}: AddressManagerModalProps) {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressInput>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof AddressInput, string>>>({});

  useEffect(() => {
    if (visible) {
      setView('list');
      setEditingId(null);
      setErrors({});
    }
  }, [visible]);

  const updateField = <K extends keyof AddressInput>(field: K, value: AddressInput[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const startAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
    setView('form');
  };

  const startEdit = (address: Address) => {
    setEditingId(address.id);
    setForm({
      label: address.label,
      line1: address.line1,
      line2: address.line2 ?? '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
      isDefault: address.isDefault,
    });
    setErrors({});
    setView('form');
  };

  const handleDelete = (address: Address) => {
    Alert.alert(
      'Delete Address',
      `Remove this ${address.label} address?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(address.id),
        },
      ],
    );
  };

  const handleSetDefault = (address: Address) => {
    onUpdate({ ...address, isDefault: true });
  };

  const handleSave = () => {
    const nextErrors: Partial<Record<keyof AddressInput, string>> = {};
    if (!form.line1.trim()) {
      nextErrors.line1 = 'Address is required.';
    }
    if (!form.city.trim()) {
      nextErrors.city = 'City is required.';
    }
    if (!form.state.trim()) {
      nextErrors.state = 'State is required.';
    }
    if (!form.pincode.trim()) {
      nextErrors.pincode = 'Pincode is required.';
    } else if (!validatePincode(form.pincode)) {
      nextErrors.pincode = 'Enter a valid 6-digit pincode.';
    }
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const payload: AddressInput = {
      ...form,
      label: form.label,
      line1: form.line1.trim(),
      line2: form.line2?.trim() || undefined,
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim(),
      country: form.country.trim() || 'India',
    };

    if (editingId) {
      onUpdate({ ...payload, id: editingId });
    } else {
      onAdd(payload);
    }
    setView('list');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheet}
        >
          <View style={styles.handle} />
          {view === 'list' ? (
            <>
              <View style={styles.headerRow}>
                <View>
                  <Text style={styles.title}>Saved Addresses</Text>
                  <Text style={styles.subtitle}>{addresses.length} address saved</Text>
                </View>
                <TouchableOpacity style={styles.addButton} onPress={startAdd} activeOpacity={0.8}>
                  <Text style={styles.addButtonText}>+ Add</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              >
                {addresses.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>📍</Text>
                    <Text style={styles.emptyTitle}>No addresses saved</Text>
                    <Text style={styles.emptyMessage}>
                      Add an address to make booking faster
                    </Text>
                  </View>
                ) : (
                  addresses.map((address) => (
                    <View key={address.id} style={styles.addressCard}>
                      <View style={styles.addressHeader}>
                        <View
                          style={[
                            styles.labelBadge,
                            { backgroundColor: labelStyles[address.label].bg },
                          ]}
                        >
                          <Text
                            style={[
                              styles.labelText,
                              { color: labelStyles[address.label].text },
                            ]}
                          >
                            {capitalize(address.label)}
                          </Text>
                        </View>
                        {address.isDefault && (
                          <View style={styles.defaultBadge}>
                            <Text style={styles.defaultText}>Default</Text>
                          </View>
                        )}
                        <View style={styles.headerSpacer} />
                        <TouchableOpacity
                          style={styles.iconButton}
                          onPress={() => startEdit(address)}
                          hitSlop={8}
                        >
                          <Text style={styles.iconButtonText}>✏️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.iconButton}
                          onPress={() => handleDelete(address)}
                          hitSlop={8}
                        >
                          <Text style={styles.iconButtonText}>🗑️</Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.addressLine1}>
                        {address.line1}
                        {address.line2 ? `, ${address.line2}` : ''}
                      </Text>
                      <Text style={styles.addressCity}>
                        {address.city}, {address.state} - {address.pincode}
                      </Text>
                      {!address.isDefault && (
                        <TouchableOpacity
                          onPress={() => handleSetDefault(address)}
                          hitSlop={8}
                        >
                          <Text style={styles.setDefaultText}>Set as default</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))
                )}
              </ScrollView>
            </>
          ) : (
            <>
              <Text style={styles.title}>
                {editingId ? 'Edit Address' : 'Add Address'}
              </Text>
              <Text style={styles.subtitle}>
                {editingId ? 'Update the details below' : 'Enter your address details'}
              </Text>
              <ScrollView
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.fieldLabel}>Label</Text>
                <View style={styles.labelChips}>
                  {(['home', 'work', 'other'] as Label[]).map((label) => {
                    const isActive = form.label === label;
                    return (
                      <TouchableOpacity
                        key={label}
                        style={[styles.labelChip, isActive && styles.labelChipActive]}
                        onPress={() => updateField('label', label)}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.labelChipText,
                            isActive && styles.labelChipTextActive,
                          ]}
                        >
                          {capitalize(label)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={styles.form}>
                  <Input
                    label="Address"
                    value={form.line1}
                    onChangeText={(text) => updateField('line1', text)}
                    placeholder="House no, street"
                    error={errors.line1}
                  />
                  <Input
                    label="Area / Landmark (optional)"
                    value={form.line2 ?? ''}
                    onChangeText={(text) => updateField('line2', text)}
                    placeholder="Area, landmark"
                  />
                  <Input
                    label="City"
                    value={form.city}
                    onChangeText={(text) => updateField('city', text)}
                    placeholder="City"
                    error={errors.city}
                  />
                  <Input
                    label="State"
                    value={form.state}
                    onChangeText={(text) => updateField('state', text)}
                    placeholder="State"
                    error={errors.state}
                  />
                  <Input
                    label="Pincode"
                    value={form.pincode}
                    onChangeText={(text) =>
                      updateField('pincode', text.replace(/[^0-9]/g, '').slice(0, 6))
                    }
                    placeholder="6-digit pincode"
                    keyboardType="number-pad"
                    maxLength={6}
                    error={errors.pincode}
                  />
                  <Input
                    label="Country"
                    value={form.country}
                    onChangeText={(text) => updateField('country', text)}
                    placeholder="Country"
                  />
                </View>

                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => updateField('isDefault', !form.isDefault)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.checkbox, form.isDefault && styles.checkboxActive]}>
                    {form.isDefault && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.checkboxLabel}>Set as default address</Text>
                </TouchableOpacity>

                <View style={styles.actions}>
                  <View style={styles.actionButton}>
                    <Button title="Cancel" onPress={() => setView('list')} variant="ghost" />
                  </View>
                  <View style={styles.actionButton}>
                    <Button title={editingId ? 'Update' : 'Save'} onPress={handleSave} />
                  </View>
                </View>
              </ScrollView>
            </>
          )}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  addButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
  },
  addButtonText: {
    ...typography.button,
    color: colors.textWhite,
  },
  listContent: {
    padding: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  addressCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  labelBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.full,
  },
  labelText: {
    ...typography.caption,
    fontWeight: '600',
  },
  defaultBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.successBg,
    marginLeft: spacing.xs,
  },
  defaultText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: '600',
  },
  headerSpacer: {
    flex: 1,
  },
  iconButton: {
    marginLeft: spacing.xs,
  },
  iconButtonText: {
    fontSize: 16,
  },
  addressLine1: {
    ...typography.body,
    color: colors.textPrimary,
  },
  addressCity: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  setDefaultText: {
    ...typography.bodySmall,
    color: colors.textLink,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyIcon: {
    fontSize: 44,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xxs,
  },
  emptyMessage: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  fieldLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  labelChips: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  labelChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  labelChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  labelChipText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  labelChipTextActive: {
    color: colors.textWhite,
  },
  form: {
    gap: spacing.md,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    ...typography.caption,
    color: colors.textWhite,
    fontWeight: '700',
  },
  checkboxLabel: {
    ...typography.body,
    color: colors.textPrimary,
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
