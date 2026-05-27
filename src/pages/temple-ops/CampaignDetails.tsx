import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "@/store/store";
import { updateCampaignStatus, addExpense, type Expense } from "@/store/slices/campaignSlice";
import { ArrowLeft, Activity, Coins, TrendingUp, ChevronRight, Share2, Receipt, CheckCircle2 } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import SmartField from "@/components/ui/SmartField";
import SmartSelect from "@/components/ui/SmartSelect";
import toast from "react-hot-toast";

const CampaignDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const campaign = useSelector((state: RootState) =>
    state.campaigns.campaigns.find((c) => c.id === id)
  );

  const [expenseForm, setExpenseForm] = useState<Partial<Expense>>({
    category: "Marketing",
    amount: 0,
    description: "",
    date: new Date().toISOString().split('T')[0]
  });
  
  const [isAddingExpense, setIsAddingExpense] = useState(false);

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-bold text-slate-800">Campaign Not Found</h2>
        <button onClick={() => navigate("/campaigns")} className="mt-4 text-brand-primary hover:underline">
          Return to Campaigns
        </button>
      </div>
    );
  }

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.amount || !expenseForm.description) return;

    dispatch(addExpense({
      id: campaign.id,
      expense: {
        id: `exp-${Math.floor(Math.random()*1000)}`,
        category: expenseForm.category as Expense["category"],
        amount: expenseForm.amount,
        description: expenseForm.description,
        date: expenseForm.date as string
      }
    }));
    toast.success("Expense logged successfully!");
    setIsAddingExpense(false);
  };

  const totalExpense = campaign.expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
  const netCollection = (campaign.fundsRaised || 0) - totalExpense;
  const roi = totalExpense > 0 ? (((campaign.fundsRaised || 0) - totalExpense) / totalExpense * 100).toFixed(1) : "0";

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-12 relative">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => navigate("/campaigns")} className="p-2 text-slate-500 hover:text-brand-primary hover:bg-brand-primary/10 rounded-full transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Campaign Analytics</span>
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">{campaign.name}</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            {campaign.name}
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
              campaign.status === "Active" ? "text-emerald-600 bg-emerald-50 border-emerald-100" :
              campaign.status === "Pending Approval" ? "text-amber-600 bg-amber-50 border-amber-100" :
              "text-slate-600 bg-slate-50 border-slate-200"
            }`}>
              {campaign.status}
            </span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">{campaign.type} • Target: ₹{campaign.targetAmount?.toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
          {campaign.status === "Active" && (
            <button className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold rounded-lg flex items-center gap-2">
              <Share2 className="w-4 h-4" /> Share Campaign
            </button>
          )}
          {campaign.status === "Active" && (
            <button 
              onClick={() => {
                dispatch(updateCampaignStatus({ id: campaign.id, status: "Completed" }));
                toast.success("Campaign Marked as Completed. Final Summary Generated.");
              }}
              className="px-4 py-2 bg-emerald-600 text-white shadow-lg text-xs font-bold rounded-lg flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Mark as Completed
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Collection" value={`₹${(campaign.fundsRaised || 0).toLocaleString()}`} icon={Coins} color="bg-emerald-50 text-emerald-600" />
        <StatCard title="Total Expenses" value={`₹${totalExpense.toLocaleString()}`} icon={Receipt} color="bg-rose-50 text-rose-600" />
        <StatCard title="Net Collection" value={`₹${netCollection.toLocaleString()}`} icon={Activity} color="bg-brand-primary/10 text-brand-primary" />
        <StatCard title="Est. ROI" value={`${roi}%`} icon={TrendingUp} color="bg-blue-50 text-blue-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Transactions & Config */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              {campaign.transactions?.length > 0 ? campaign.transactions.map(txn => (
                <div key={txn.id} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <div className="text-xs font-bold text-slate-800">{txn.donorName}</div>
                    <div className="text-[10px] text-slate-500">{txn.date} • {txn.status}</div>
                  </div>
                  <div className="text-sm font-bold text-emerald-600">+₹{txn.amount}</div>
                </div>
              )) : (
                <div className="text-xs text-slate-500 py-4 text-center">No transactions yet.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Expenses */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-800">Expense Tracker</h3>
              {campaign.status !== "Completed" && (
                <button onClick={() => setIsAddingExpense(!isAddingExpense)} className="text-[10px] font-bold text-brand-primary bg-brand-primary/10 px-2 py-1 rounded-md">
                  + Add Expense
                </button>
              )}
            </div>

            {isAddingExpense && (
              <form onSubmit={handleAddExpense} className="mb-4 p-4 border border-brand-primary/20 bg-brand-primary/5 rounded-xl space-y-3">
                <SmartSelect label="Category" value={(expenseForm.category as string) || "Marketing"} onChange={v => setExpenseForm(p => ({...p, category: v as any}))} options={["Advertisement", "Vendor", "Event", "Marketing"]} />
                <SmartField label="Amount (₹)" type="number" value={expenseForm.amount?.toString() || ""} onChange={v => setExpenseForm(p => ({...p, amount: parseInt(v) || 0}))} />
                <SmartField label="Description" value={expenseForm.description || ""} onChange={v => setExpenseForm(p => ({...p, description: v}))} />
                <SmartField label="Date" type="date" value={expenseForm.date || ""} onChange={v => setExpenseForm(p => ({...p, date: v}))} />
                <div className="flex gap-2">
                  <button type="button" onClick={() => setIsAddingExpense(false)} className="flex-1 text-xs py-2 bg-white border border-slate-200 rounded-md text-slate-600">Cancel</button>
                  <button type="submit" className="flex-1 text-xs py-2 bg-brand-primary text-white rounded-md">Save Expense</button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {campaign.expenses?.length > 0 ? campaign.expenses.map(exp => (
                <div key={exp.id} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <div className="text-xs font-bold text-slate-800">{exp.category}</div>
                    <div className="text-[10px] text-slate-500">{exp.description}</div>
                  </div>
                  <div className="text-sm font-bold text-rose-600">-₹{exp.amount}</div>
                </div>
              )) : (
                <div className="text-xs text-slate-500 py-4 text-center">No expenses recorded.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;