import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Calendar,
  Percent,
  DollarSign,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import couponService, { Coupon } from '@/lib/coupons';

const CouponManagement = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [stats, setStats] = useState({
    totalCoupons: 0,
    activeCoupons: 0,
    expiredCoupons: 0,
    totalUsage: 0,
    totalDiscountGiven: 0,
  });

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 0,
    minOrderAmount: '',
    maxDiscountAmount: '',
    usageLimit: '',
    validFrom: '',
    validUntil: '',
    isActive: true,
  });

  useEffect(() => {
    loadCoupons();
    loadStats();
  }, []);

  const loadCoupons = () => {
    const allCoupons = couponService.getAllCoupons();
    setCoupons(allCoupons.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const loadStats = () => {
    const couponStats = couponService.getCouponStats();
    setStats(couponStats);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      type: 'percentage',
      value: 0,
      minOrderAmount: '',
      maxDiscountAmount: '',
      usageLimit: '',
      validFrom: '',
      validUntil: '',
      isActive: true,
    });
  };

  const generateCode = () => {
    const newCode = couponService.generateCouponCode();
    setFormData(prev => ({ ...prev, code: newCode }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleCreateCoupon = () => {
    try {
      const couponData = {
        code: formData.code.toUpperCase(),
        name: formData.name,
        description: formData.description,
        type: formData.type,
        value: formData.value,
        minOrderAmount: formData.minOrderAmount ? parseInt(formData.minOrderAmount) * 100 : undefined,
        maxDiscountAmount: formData.maxDiscountAmount ? parseInt(formData.maxDiscountAmount) * 100 : undefined,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
        validFrom: formData.validFrom || new Date().toISOString(),
        validUntil: formData.validUntil,
        isActive: formData.isActive,
      };

      couponService.createCoupon(couponData);
      toast.success('Coupon created successfully!');
      setIsCreateDialogOpen(false);
      resetForm();
      loadCoupons();
      loadStats();
    } catch (error) {
      toast.error('Failed to create coupon');
    }
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      name: coupon.name,
      description: coupon.description,
      type: coupon.type,
      value: coupon.value,
      minOrderAmount: coupon.minOrderAmount ? (coupon.minOrderAmount / 100).toString() : '',
      maxDiscountAmount: coupon.maxDiscountAmount ? (coupon.maxDiscountAmount / 100).toString() : '',
      usageLimit: coupon.usageLimit ? coupon.usageLimit.toString() : '',
      validFrom: coupon.validFrom.split('T')[0],
      validUntil: coupon.validUntil.split('T')[0],
      isActive: coupon.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateCoupon = () => {
    if (!editingCoupon) return;

    try {
      const updates = {
        code: formData.code.toUpperCase(),
        name: formData.name,
        description: formData.description,
        type: formData.type,
        value: formData.value,
        minOrderAmount: formData.minOrderAmount ? parseInt(formData.minOrderAmount) * 100 : undefined,
        maxDiscountAmount: formData.maxDiscountAmount ? parseInt(formData.maxDiscountAmount) * 100 : undefined,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
        validFrom: formData.validFrom || new Date().toISOString(),
        validUntil: formData.validUntil,
        isActive: formData.isActive,
      };

      couponService.updateCoupon(editingCoupon.id, updates);
      toast.success('Coupon updated successfully!');
      setIsEditDialogOpen(false);
      setEditingCoupon(null);
      resetForm();
      loadCoupons();
      loadStats();
    } catch (error) {
      toast.error('Failed to update coupon');
    }
  };

  const handleDeleteCoupon = (id: string) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      couponService.deleteCoupon(id);
      toast.success('Coupon deleted successfully!');
      loadCoupons();
      loadStats();
    }
  };

  const toggleCouponStatus = (coupon: Coupon) => {
    couponService.updateCoupon(coupon.id, { isActive: !coupon.isActive });
    toast.success(`Coupon ${!coupon.isActive ? 'activated' : 'deactivated'}`);
    loadCoupons();
    loadStats();
  };

  const getStatusBadge = (coupon: Coupon) => {
    const now = new Date().toISOString();
    
    if (!coupon.isActive) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    
    if (coupon.validUntil < now) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    
    if (coupon.validFrom > now) {
      return <Badge variant="outline">Scheduled</Badge>;
    }
    
    return <Badge variant="default" className="bg-green-500">Active</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return `₹${(amount / 100).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Coupon Management</h1>
          <p className="text-gray-600">Create and manage discount coupons</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
            </DialogHeader>
            <CouponForm 
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleCreateCoupon}
              onCancel={() => setIsCreateDialogOpen(false)}
              generateCode={generateCode}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Coupons</p>
                <p className="text-2xl font-bold">{stats.totalCoupons}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeCoupons}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expired</p>
                <p className="text-2xl font-bold text-red-600">{stats.expiredCoupons}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Usage</p>
                <p className="text-2xl font-bold">{stats.totalUsage}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Discount Given</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(stats.totalDiscountGiven)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coupons List */}
      <Card>
        <CardHeader>
          <CardTitle>All Coupons</CardTitle>
        </CardHeader>
        <CardContent>
          {coupons.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No coupons created yet</p>
              <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Coupon
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {coupons.map((coupon) => (
                <div key={coupon.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">{coupon.code}</h3>
                        <p className="text-sm text-gray-600">{coupon.name}</p>
                      </div>
                      {getStatusBadge(coupon)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(coupon.code)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCoupon(coupon)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleCouponStatus(coupon)}
                      >
                        <Switch className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCoupon(coupon.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Discount</p>
                      <p className="text-gray-600">
                        {coupon.type === 'percentage' ? `${coupon.value}%` : formatCurrency(coupon.value)}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Usage</p>
                      <p className="text-gray-600">
                        {coupon.usedCount} / {coupon.usageLimit || '∞'}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Valid Until</p>
                      <p className="text-gray-600">{formatDate(coupon.validUntil)}</p>
                    </div>
                    <div>
                      <p className="font-medium">Min Order</p>
                      <p className="text-gray-600">
                        {coupon.minOrderAmount ? formatCurrency(coupon.minOrderAmount) : 'No minimum'}
                      </p>
                    </div>
                  </div>
                  
                  {coupon.description && (
                    <p className="text-sm text-gray-600 mt-2">{coupon.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Coupon</DialogTitle>
          </DialogHeader>
          <CouponForm 
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleUpdateCoupon}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setEditingCoupon(null);
              resetForm();
            }}
            generateCode={generateCode}
            isEdit={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Coupon Form Component
const CouponForm = ({ 
  formData, 
  setFormData, 
  onSubmit, 
  onCancel, 
  generateCode,
  isEdit = false 
}: {
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
  generateCode: () => void;
  isEdit?: boolean;
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="code">Coupon Code</Label>
          <div className="flex gap-2">
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="SAVE20"
              required
            />
            <Button type="button" variant="outline" onClick={generateCode}>
              Generate
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="name">Coupon Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Summer Sale 20% Off"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Get 20% off on all summer collection items"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Discount Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="fixed">Fixed Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="value">
            {formData.type === 'percentage' ? 'Percentage (%)' : 'Amount (₹)'}
          </Label>
          <Input
            id="value"
            type="number"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
            placeholder={formData.type === 'percentage' ? '20' : '100'}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="minOrderAmount">Minimum Order Amount (₹)</Label>
          <Input
            id="minOrderAmount"
            type="number"
            value={formData.minOrderAmount}
            onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
            placeholder="500"
          />
        </div>

        <div>
          <Label htmlFor="maxDiscountAmount">Maximum Discount Amount (₹)</Label>
          <Input
            id="maxDiscountAmount"
            type="number"
            value={formData.maxDiscountAmount}
            onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
            placeholder="1000"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="usageLimit">Usage Limit</Label>
          <Input
            id="usageLimit"
            type="number"
            value={formData.usageLimit}
            onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
            placeholder="100 (leave empty for unlimited)"
          />
        </div>

        <div>
          <Label htmlFor="validUntil">Valid Until</Label>
          <Input
            id="validUntil"
            type="date"
            value={formData.validUntil}
            onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
        <Label htmlFor="isActive">Active</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEdit ? 'Update Coupon' : 'Create Coupon'}
        </Button>
      </div>
    </form>
  );
};

export default CouponManagement;
