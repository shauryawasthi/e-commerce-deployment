# include <bits/stdc++.h>
using namespace std;
int main()
{
    int m,n;
    cin>>n>>m;
    int ans;
    
    vector <int> p(n);
    for(int i=0;i<n;i++)
    cin>>p[i];
    int sum=0;int begin=0,end=0;
    for(;end<n;end++)
    {
        sum+=p[end];
        while(sum>m)
        {
            sum=sum-p[begin];
            begin++;
        }
        if(sum<=m)
        {
            ans=max(ans,end-begin+1);
        }
    }
    cout<<ans<<endl;
}