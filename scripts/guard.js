// Safety check that runs before every deploy.
// FleetSight may only be deployed to a Firebase project whose ID contains "fleetsight".
const project = process.env.GCLOUD_PROJECT || '';
console.log('\n  FleetSight is about to deploy to Firebase project: ' + (project || '(unknown)') + '\n');
if (project && !/fleetsight/i.test(project)) {
  console.error('  STOPPED: this is not your FleetSight project.');
  console.error('  Run "firebase use" and choose the project whose ID contains "fleetsight", then deploy again.\n');
  process.exit(1);
}
