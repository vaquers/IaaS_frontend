import { useMemo, useRef, useState } from 'react';
import ForceGraph2D, {
  type ForceGraphMethods
} from 'react-force-graph-2d';
import type { Project } from '../../domain/iaasTypes';
import { useProjectsStore } from '../../store/projectsStore';
import './ProjectsPages.css';

type NodeType = 'internet' | 'vm' | 'network-public' | 'network-private' | 'ip';

interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  vmId?: string;
  networkId?: string;
}

interface GraphLink {
  source: string;
  target: string;
  kind: 'public' | 'http' | 'db' | 'attached';
}

interface ProjectGraphTabProps {
  project: Project;
}

export function ProjectGraphTab({ project }: ProjectGraphTabProps) {
  const graphRef = useRef<ForceGraphMethods | undefined>();
  const [showNetworks, setShowNetworks] = useState(true);
  const [showStorage, setShowStorage] = useState(true);
  const [onlyPublic, setOnlyPublic] = useState(false);
  const [selectedVmId, setSelectedVmId] = useState<string | undefined>();

  const setHighlightedVm = useProjectsStore((state) => state.setHighlightedVm);
  const toggleVmPort = useProjectsStore((state) => state.toggleVmPort);

  const { nodes, links } = useMemo(() => {
    const nodes: GraphNode[] = [
      { id: 'internet', label: 'Internet', type: 'internet' }
    ];
    const links: GraphLink[] = [];

    project.resources.networks.forEach((net) => {
      nodes.push({
        id: `net-${net.id}`,
        label: net.name,
        type: net.type === 'public' ? 'network-public' : 'network-private',
        networkId: net.id
      });
    });

    project.resources.vms.forEach((vm) => {
      nodes.push({
        id: `vm-${vm.id}`,
        label: vm.name,
        type: 'vm',
        vmId: vm.id
      });

      if (vm.publicIp) {
        nodes.push({
          id: `ip-${vm.id}`,
          label: vm.publicIp,
          type: 'ip',
          vmId: vm.id
        });
        links.push({
          source: 'internet',
          target: `ip-${vm.id}`,
          kind: 'public'
        });
        links.push({
          source: `ip-${vm.id}`,
          target: `vm-${vm.id}`,
          kind: 'public'
        });
      } else if (vm.privateIp) {
        const publicNet = project.resources.networks.find(
          (n) => n.type === 'public'
        );
        if (publicNet) {
          links.push({
            source: 'internet',
            target: `net-${publicNet.id}`,
            kind: 'public'
          });
          links.push({
            source: `net-${publicNet.id}`,
            target: `vm-${vm.id}`,
            kind: 'attached'
          });
        }
      }
    });

    const frontends = project.resources.vms.filter((vm) => vm.role === 'frontend');
    const backends = project.resources.vms.filter((vm) => vm.role === 'backend');
    const dbs = project.resources.vms.filter((vm) => vm.role === 'db');

    frontends.forEach((fe) => {
      backends.forEach((be) => {
        links.push({
          source: `vm-${fe.id}`,
          target: `vm-${be.id}`,
          kind: 'http'
        });
      });
    });

    backends.forEach((be) => {
      dbs.forEach((db) => {
        links.push({
          source: `vm-${be.id}`,
          target: `vm-${db.id}`,
          kind: 'db'
        });
      });
    });

    project.resources.networks
      .filter((net) => net.type === 'private')
      .forEach((net) => {
        project.resources.vms
          .filter((vm) => vm.privateIp)
          .forEach((vm) => {
            links.push({
              source: `vm-${vm.id}`,
              target: `net-${net.id}`,
              kind: 'attached'
            });
          });
      });

    return { nodes, links };
  }, [project]);

  const filteredNodes = nodes.filter((node) => {
    if (!showNetworks && (node.type === 'network-public' || node.type === 'network-private')) {
      return false;
    }
    if (!showStorage && node.type === 'ip') {
      return false;
    }
    return true;
  });

  const filteredLinks = links.filter((link) => {
    if (onlyPublic && link.kind !== 'public') return false;
    return true;
  });

  const selectedVm =
    selectedVmId &&
    project.resources.vms.find((vm) => vm.id === selectedVmId);

  const handleRecenter = () => {
    if (!graphRef.current) return;
    graphRef.current.zoomToFit(400);
  };

  return (
    <div className="graph-root">
      <div className="graph-toolbar">
        <label>
          <input
            type="checkbox"
            checked={showNetworks}
            onChange={(event) => setShowNetworks(event.target.checked)}
          />
          Показать сети
        </label>
        <label>
          <input
            type="checkbox"
            checked={showStorage}
            onChange={(event) => setShowStorage(event.target.checked)}
          />
          Показать публичные IP
        </label>
        <label>
          <input
            type="checkbox"
            checked={onlyPublic}
            onChange={(event) => setOnlyPublic(event.target.checked)}
          />
          Только публичные связи
        </label>
        <button type="button" className="project-card-open-btn" onClick={handleRecenter}>
          Recenter
        </button>
      </div>

      <div className="graph-zones">
        <div className="graph-zone graph-zone-public">Public zone</div>
        <div className="graph-zone graph-zone-private">Private zone</div>
      </div>

      <div className="graph-canvas">
        <ForceGraph2D
          ref={graphRef as any}
          graphData={{ nodes: filteredNodes, links: filteredLinks }}
          nodeCanvasObject={(nodeObj, ctx, globalScale) => {
            const node = nodeObj as unknown as GraphNode;
            const label = node.label;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;

            let fill = '#ffffff';
            let stroke = '#d0d0d0';
            if (node.type === 'internet') {
              fill = '#FF0023';
              stroke = '#FF0023';
            } else if (node.type === 'vm') {
              fill = '#ffffff';
              stroke = '#FF0023';
            } else if (node.type === 'network-public') {
              fill = '#ffecec';
            } else if (node.type === 'network-private') {
              fill = '#f1f1f5';
            } else if (node.type === 'ip') {
              fill = '#ffffff';
              stroke = '#b0b0b0';
            }

            const radius = 18;
            ctx.beginPath();
            ctx.arc(nodeObj.x as number, nodeObj.y as number, radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = fill;
            ctx.fill();
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.fillStyle = node.type === 'internet' ? '#ffffff' : '#333333';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, nodeObj.x as number, (nodeObj.y as number) - radius - 6);
          }}
          linkColor={(linkObj) => {
            const link = linkObj as unknown as GraphLink;
            if (link.kind === 'public') return 'rgba(248, 113, 113, 0.9)';
            if (link.kind === 'http') return 'rgba(59, 130, 246, 0.9)';
            if (link.kind === 'db') return 'rgba(129, 140, 248, 0.9)';
            return 'rgba(148, 163, 184, 0.6)';
          }}
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={1}
          onNodeClick={(nodeObj) => {
            const node = nodeObj as unknown as GraphNode;
            if (node.vmId) {
              setSelectedVmId(node.vmId);
              setHighlightedVm(node.vmId);
            }
          }}
        />
      </div>

      {selectedVm && (
        <aside className="graph-sidepanel">
          <h3 className="projects-empty-title">{selectedVm.name}</h3>
          <p className="projects-empty-text">
            Роль: {selectedVm.role} • Состояние: {selectedVm.state}
          </p>
          <p className="projects-empty-text">
            CPU {selectedVm.cpu} vCPU • RAM {selectedVm.ram} ГБ • Disk {selectedVm.disk} ГБ
          </p>
          <p className="projects-empty-text">
            Public IP: {selectedVm.publicIp ?? '—'}
            <br />
            Private IP: {selectedVm.privateIp ?? '—'}
          </p>
          <div className="projects-empty-actions">
            <button
              type="button"
              className="project-card-open-btn"
              onClick={() =>
                toggleVmPort(
                  selectedVm.id,
                  22
                )
              }
            >
              Тумблер SSH (22)
            </button>
            <button
              type="button"
              className="project-card-open-btn"
              onClick={() => {
                const ip = selectedVm.publicIp ?? selectedVm.privateIp ?? '0.0.0.0';
                const ssh = `ssh clouduser@${ip}`;
                void navigator.clipboard.writeText(ssh);
              }}
            >
              Copy SSH
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}

